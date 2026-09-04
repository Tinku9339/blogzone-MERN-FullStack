import api from './axios.js'

// GET /api/blogs/Blogs — every blog, published or draft (used in the admin area)
export const fetchAllBlogs = () => api.get('/blogs/Blogs')

// GET /api/blogs/published — only published blogs (used on the public site)
export const fetchPublishedBlogs = () => api.get('/blogs/published')

export const fetchMyBlogs = () => api.get('/blogs/mine')
// GET /api/blogs/category/:category
export const fetchBlogsByCategory = (category) =>
  api.get(`/blogs/category/${encodeURIComponent(category)}`)

// GET /api/blogs/Blog/:id
export const fetchBlogById = (id) => api.get(`/blogs/Blog/${id}`)

// POST /api/blogs/createBlog — { title, description, category, image, isPublished }
export const createBlog = (payload) => api.post('/blogs/createBlog', payload)

// PUT /api/blogs/edit/:id
export const updateBlog = (id, payload) => api.put(`/blogs/edit/${id}`, payload)

// DELETE /api/blogs/del/:id
export const deleteBlog = (id) => api.delete(`/blogs/del/${id}`)

// POST /api/blogs/generate-description — { title, category } -> { data: { description } }
export const generateDescription = (payload) => api.post('/blogs/generate-description', payload)

// POST /api/blogs/:id/like — toggle like for current user
export const likeBlog = (id) => api.post(`/blogs/${id}/like`)
