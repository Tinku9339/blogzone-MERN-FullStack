import express from 'express';
import mongoose from 'mongoose';
import { authenticate } from '../middlewares/authMiddleware.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

const router = express.Router();

// GET /api/dashboard/health — public health check
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    success: true,
    message: 'BlogZone API is running',
    database: dbStatusMap[dbState] || 'unknown',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});


router.get('/stats', authenticate, async (req, res) => {
  try {
    const myBlogIds = await Blog.find({ author: req.id }).distinct('_id');
    const [totalBlogs, published, drafts, totalComments, pendingComments, recentBlogs] =
      await Promise.all([
        Blog.countDocuments({ author: req.id }),
        Blog.countDocuments({ author: req.id, isPublished: true }),
        Blog.countDocuments({ author: req.id, isPublished: false }),
        Comment.countDocuments({ blogId: { $in: myBlogIds } }),
        Comment.countDocuments({
          blogId: { $in: myBlogIds } , 
          isApproved: false }),
        Blog.find({ author: req.id })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('title image category isPublished createdAt'),
      ]);

    res.status(200).json({
      success: true,
      data: { totalBlogs, published, drafts, totalComments, pendingComments, recentBlogs },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
