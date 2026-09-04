import {
  createComment,
  findCommentsByBlog,
  findAllComments,
  approveCommentById,
  deleteCommentById,
  findCommentById,
  softDeleteCommentById,
  findCommentForAuthor,
} from '../repositories/commentRepositories.js';

export const submitComment = async ({ blogId, name, email, content, userId }) => {
  if (!blogId || !name || !content) {
    throw new Error('blogId, name, and content are required');
  }
  return await createComment({
    blogId,
    name,
    email: email || '',
    content,
    userId: userId || null,
    isApproved: true, // auto-approve for instant real-time publishing
  });
};

export const getCommentsByBlog = async (blogId) => {
  return await findCommentsByBlog(blogId);
};

export const getAllCommentsService = async (userId) => {
  return await findAllComments(userId);
};

export const approveComment = async (id, userId) => { 
  const comment = await findCommentForAuthor(id, userId);
  if (!comment) throw new Error('Comment not found or you are not allowed to approve it');
  comment.isApproved = true;
  return await comment.save();
};

export const deleteComment = async (id, userId) => {
  const comment = await findCommentById(id);

  if (!comment || comment.isDeleted) {
    throw new Error('Comment not found');
  }

  // Both the commenter and the post author are authorized to soft-delete
  const isCommenter = comment.userId && comment.userId.toString() === userId.toString();
  const isPostAuthor =
    comment.blogId &&
    comment.blogId.author &&
    comment.blogId.author.toString() === userId.toString();

  if (!isCommenter && !isPostAuthor) {
    throw new Error('You are not authorized to delete this comment');
  }

  return await softDeleteCommentById(id, userId);
};
