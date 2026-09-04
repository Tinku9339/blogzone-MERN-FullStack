import axios from 'axios'

const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const cleanBaseURL = rawBaseURL.replace(/\/+$/, '')
const baseURL = cleanBaseURL.endsWith('/api') ? cleanBaseURL : `${cleanBaseURL}/api`

const api = axios.create({
  baseURL,
})

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bz_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Centralize the "session expired" behavior: any 401 from a protected
// endpoint means the token is missing/invalid/expired, so we clear it
// and let the app fall back to a logged-out state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bz_token')
      localStorage.removeItem('bz_user')
      if (!window.location.pathname.startsWith('/login')) {
        window.dispatchEvent(new CustomEvent('bz:unauthorized'))
      }
    }
    return Promise.reject(error)
  }
)

// Pulls a human-readable message out of the backend's
// { success: false, message } error shape, with a safe fallback.
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  return error?.response?.data?.message || error?.message || fallback
}

export default api
