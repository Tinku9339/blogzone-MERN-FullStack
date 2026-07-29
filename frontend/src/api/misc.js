import api from './axios.js'

// POST /api/upload — auth, multipart field "image" -> { success, url }
export const uploadImage = (file, onProgress) => {
  const formData = new FormData()
  formData.append('image', file)
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded * 100) / evt.total))
      }
    },
  })
}

// GET /api/dashboard/stats — auth -> { data: { totalBlogs, published, drafts, totalComments, pendingComments, recentBlogs } }
export const fetchDashboardStats = () => api.get('/dashboard/stats')

// GET /api/dashboard/health — public
export const fetchHealth = () => api.get('/dashboard/health')
