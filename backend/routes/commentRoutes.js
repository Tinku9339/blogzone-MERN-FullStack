import express from 'express';
import {
  postComment,
  getCommentsForBlog,
  getAllComments,
  approveCommentById,
  deleteCommentById,
} from '../controllers/commentController.js';
import { authenticate, optionalAuthenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (authenticated users have user id automatically bound)
router.post('/:blogId', optionalAuthenticate, postComment);
router.get('/:blogId', getCommentsForBlog);

// Admin-only routes
router.get('/', authenticate, getAllComments);
router.patch('/:id/approve', authenticate, approveCommentById);
router.delete('/:id', authenticate, deleteCommentById);

export default router;
