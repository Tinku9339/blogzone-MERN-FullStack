import api from './axios.js'

// POST /api/comments/:blogId — public, { name, email, content }
export const postComment = (blogId, payload) => api.post(`/comments/${blogId}`, payload)

// GET /api/comments/:blogId — public, approved comments only
export const fetchCommentsForBlog = (blogId) => api.get(`/comments/${blogId}`)

// GET /api/comments — auth, every comment (populated with blog title)
export const fetchAllComments = () => api.get('/comments')

// PATCH /api/comments/:id/approve — auth
export const approveComment = (id) => api.patch(`/comments/${id}/approve`)

// DELETE /api/comments/:id — auth
export const deleteComment = (id) => api.delete(`/comments/${id}`)
