import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { loginRequest, signupRequest } from '../api/auth.js'
import { fetchMe } from '../api/profile.js'
import { getErrorMessage } from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('bz_token'))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('bz_user')
    return raw ? JSON.parse(raw) : null
  })
  // Starts true whenever we have a token, so protected routes wait for the
  // /getMe refresh instead of bouncing the user to /login for a split second.
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('bz_token')))

  const persistSession = useCallback((nextToken, nextUser) => {
    if (nextToken) localStorage.setItem('bz_token', nextToken)
    if (nextUser) localStorage.setItem('bz_user', JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('bz_token')
    localStorage.removeItem('bz_user')
    setToken(null)
    setUser(null)
  }, [])

  // Keep the profile fresh and validate the stored token on first load.
  useEffect(() => {
    let cancelled = false
    if (!token) {
      setLoading(false)
      return
    }
    fetchMe()
      .then((res) => {
        if (cancelled) return
        const freshUser = res.data.user
        setUser(freshUser)
        localStorage.setItem('bz_user', JSON.stringify(freshUser))
      })
      .catch(() => {
        if (cancelled) return
        logout()
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // React to a 401 raised anywhere in the app (axios interceptor).
  useEffect(() => {
    const handleUnauthorized = () => logout()
    window.addEventListener('bz:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('bz:unauthorized', handleUnauthorized)
  }, [logout])

  const login = useCallback(async ({ email, password }) => {
    try {
      const res = await loginRequest({ email, password })
      const { token: newToken, user: newUser } = res.data
      persistSession(newToken, newUser)
      return { ok: true }
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, 'Could not log in.') }
    }
  }, [persistSession])

  const signup = useCallback(async ({ name, email, password }) => {
    try {
      const res = await signupRequest({ name, email, password })
      const { token: newToken, user: newUser } = res.data
      if (newToken && newUser) {
        persistSession(newToken, newUser)
      }
      return {
        ok: true,
        user: newUser,
        recoveryKey: res.data.recoveryKey || newUser?.recoveryKey,
      }
    } catch (error) {
      return { ok: false, message: getErrorMessage(error, 'Could not create your account.') }
    }
  }, [persistSession])

  const refreshUser = useCallback(async () => {
    const res = await fetchMe()
    setUser(res.data.user)
    localStorage.setItem('bz_user', JSON.stringify(res.data.user))
    return res.data.user
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loading,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [token, user, loading, login, signup, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
