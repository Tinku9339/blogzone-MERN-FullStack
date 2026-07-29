import api from './axios.js'

// POST /api/auth/signup — { name, email, password } -> { success, message, userId, name, email }
export const signupRequest = (payload) => api.post('/auth/signup', payload)

// POST /api/auth/login — { email, password } -> { success, message, token, user }
export const loginRequest = (payload) => api.post('/auth/login', payload)
