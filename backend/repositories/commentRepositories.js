import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';


export const createComment = async (data) => {
  return await Comment.create(data);
};

export const findCommentsByBlog = async (blogId) => {
  return await Comment.find({ blogId, isApproved: true, isDeleted: { $ne: true } })
    .populate('userId', 'name profileImage')
    .sort({ createdAt: -1 });
};

export const findAllComments = async (authorId) => {
  const blogIds = await Blog.find({ author: authorId }).distinct('_id');

  return await Comment.find({ blogId: { $in: blogIds }, isDeleted: { $ne: true } })
    .populate('blogId', 'title author')
    .populate('userId', 'name profileImage')
    .sort({ createdAt: -1 });
};

export const findCommentById = async (id) => {
  return await Comment.findById(id).populate('blogId', 'author title');
};

export const approveCommentById = async (id) => {
  return await Comment.findByIdAndUpdate(id, { isApproved: true }, { new: true });
};

export const softDeleteCommentById = async (id, deletedBy) => {
  return await Comment.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: deletedBy || null,
    },
    { new: true }
  );
};

export const deleteCommentById = async (id) => {
  return await Comment.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
};

export const countPendingComments = async () => {
  return await Comment.countDocuments({ isApproved: false, isDeleted: { $ne: true } });
};

export const countAllComments = async () => {
  return await Comment.countDocuments({ isDeleted: { $ne: true } });
};

export const findCommentForAuthor = async (commentId, authorId) => {
  const comment = await Comment.findById(commentId).populate('blogId', 'author');

  if (!comment || !comment.blogId || comment.isDeleted) {
    return null;
  }
  if (comment.blogId.author.toString() !== authorId.toString()) {
    return null;
  }
  return comment;
};