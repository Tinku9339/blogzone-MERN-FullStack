import api from './axios.js'

// GET /api/profile/getMe — auth -> { user }
export const fetchMe = () => api.get('/profile/getMe')

// PUT /api/profile/update — auth, any of { name, bio, description, profileImage, writingCategory }
export const updateProfile = (payload) => api.put('/profile/update', payload)

// PUT /api/profile/change-password — auth, { oldPassword, newPassword }
export const changePassword = (payload) => api.put('/profile/change-password', payload)

// GET /api/profile/author/:id — public author profile + published blogs
export const fetchAuthorProfile = (authorId) => api.get(`/profile/author/${authorId}`)
