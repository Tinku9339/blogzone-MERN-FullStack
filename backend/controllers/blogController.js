import {
  createBlogEntry,
  getAllBlogs,
  getMyBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
  getPublishedBlogs,
} from '../services/blogServices.js'
import { generateBlogDescriptionService } from '../services/aiServices.js';

export const createBlog = async (req, res) => {
  try {
    const blog = await createBlogEntry(req.body,req.id)
    res.status(201).json({ success: true, data: blog })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const fetchAllBlogs = async (req, res) => {
  try {
    const blogs = await getAllBlogs()
    res.status(200).json({ success: true, data: blogs })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
export const fetchMyBlogs = async (req, res) => {
  try {
    const blogs = await getMyBlogs(req.id)
    res.status(200).json({ success: true, data: blogs })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
export const fetchBlogById = async (req, res) => {
  try {
    const blog = await getBlogById(req.params.id)
    res.status(200).json({ success: true, data: blog })
  } catch (error) {
    res.status(404).json({ success: false, message: error.message })
  }
}

export const editBlog = async (req, res) => {
  try {
    const blog = await updateBlog(req.params.id,req.id,req.body)
    res.status(200).json({ success: true, data: blog })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const removeBlog = async (req, res) => {
  try {
    const blog = await deleteBlog(req.params.id,req.id)
    res.status(200).json({ success: true, data: blog })
  } catch (error) {
    res.status(404).json({ success: false, message: error.message })
  }
}

export const fetchBlogsByCategory = async (req, res) => {
  try {
    const blogs = await getBlogsByCategory(req.params.category)
    res.status(200).json({ success: true, data: blogs })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const fetchPublishedBlogs = async (req, res) => {
  try {
    const blogs = await getPublishedBlogs()
    res.status(200).json({ success: true, data: blogs })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const generateDescription = async (req, res) => {
  try {
    const { title, category } = req.body;
    
    const generatedDescription = await generateBlogDescriptionService(title, category);
    
    res.status(200).json({ 
      success: true, 
      data: { description: generatedDescription } 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};