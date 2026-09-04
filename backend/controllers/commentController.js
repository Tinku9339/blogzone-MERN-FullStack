import {
  submitComment,
  getCommentsByBlog,
  getAllCommentsService,
  approveComment,
  deleteComment,
} from '../services/commentServices.js';

// POST /api/comments/:blogId  — public/auth, submit a comment
export const postComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { name, email, content } = req.body;
    const userId = req.id || req.body.userId || null;
    const comment = await submitComment({ blogId, name, email, content, userId });
    res.status(201).json({ success: true, data: comment, message: 'Comment posted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/comments/:blogId  — public, approved comments for a blog
export const getCommentsForBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await getCommentsByBlog(blogId);
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/comments  — admin only, all comments
export const getAllComments = async (req, res) => {
  try {
    const comments = await getAllCommentsService(req.id);
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/comments/:id/approve  — admin only
export const approveCommentById = async (req, res) => {
  try {
    const comment = await approveComment(req.params.id,req.id);
    res.status(200).json({ success: true, data: comment, message: 'Comment approved' });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// DELETE /api/comments/:id  — admin only
export const deleteCommentById = async (req, res) => {
  try {
    await deleteComment(req.params.id,req.id);
    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
