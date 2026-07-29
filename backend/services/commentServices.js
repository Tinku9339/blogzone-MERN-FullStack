import {
  createComment,
  findCommentsByBlog,
  findAllComments,
  approveCommentById,
  deleteCommentById,
} from '../repositories/commentRepositories.js';

export const submitComment = async ({ blogId, name, email, content }) => {
  if (!blogId || !name || !content) {
    throw new Error('blogId, name, and content are required');
  }
  return await createComment({ blogId, name, email: email || '', content });
};

export const getCommentsByBlog = async (blogId) => {
  return await findCommentsByBlog(blogId);
};

export const getAllCommentsService = async (userId) => {
  return await findAllComments(userId);
};

export const approveComment = async (id,userId) => { 
  const comment = await findCommentForAuthor(id, userId);
  if (!comment) throw new Error('Comment not found');
  comment.isApproved = true;
  return await comment.save();
};

export const deleteComment = async (id) => {
  const comment = await findCommentForAuthor(id, userId);

  if (!comment) {
    throw new Error('Comment not found or you are not allowed to delete it');
  }

  return await comment.deleteOne();
};
