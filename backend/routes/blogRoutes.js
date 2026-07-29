import express from 'express'
import {
  createBlog,
  fetchAllBlogs,
  fetchBlogById,
  editBlog,
  removeBlog,
  fetchBlogsByCategory,
  fetchPublishedBlogs,
  fetchMyBlogs,
} from '../controllers/blogController.js'
import { authenticate } from '../middlewares/authMiddleware.js'
import { generateDescription } from '../controllers/blogController.js';


const router = express.Router()
router.get('/mine', authenticate, fetchMyBlogs)
router.post('/generate-description', authenticate, generateDescription);
router.get('/Blogs', fetchAllBlogs)
router.get('/published', fetchPublishedBlogs)
router.get('/category/:category', fetchBlogsByCategory)
router.get('/Blog/:id', fetchBlogById)
router.post('/createBlog', authenticate, createBlog)
router.put('/edit/:id', authenticate, editBlog)
router.delete('/del/:id', authenticate, removeBlog)

export default router
