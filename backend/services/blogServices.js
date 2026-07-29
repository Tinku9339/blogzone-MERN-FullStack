import {
  createBlog,
  findAllBlogs,
  findBlogById,
  updateBlogByIdForAuthor,
  findBlogsByCategory,
  findPublishedBlogs,
  findBlogsByAuthor,
  deleteBlogByIdForAuthor,
} from "../repositories/blogRepositories.js";

export const createBlogEntry = async (blogData, userId) => {
  
  const { title, description, category, image, isPublished } = blogData;

  
  if (!title || !description || !category || !image) {
    throw new Error(
      "Missing required blog fields: title, description, category, image"
    );
  }

  
  return await createBlog({
    title,
    description,
    category,
    image,
    isPublished: Boolean(isPublished),
    author: userId,
  });
};
export const getMyBlogs = async(userId)=>{
  return await findBlogsByAuthor(userId)
}
export const getAllBlogs = async (filter = {}) => {
  return await findAllBlogs(filter);
};

export const getBlogById = async (id) => {
  const blog = await findBlogById(id);
  if (!blog) {
    throw new Error("Blog not found");
  }
  return blog;
};

export const updateBlog = async (id,userId,updates) => {
  const allowedUpdates = {
    title: updates.title,
    description: updates.description,
    category: updates.category,
    image: updates.image,
    isPublished: updates.isPublished,
  }

  Object.keys(allowedUpdates).forEach((key) => {
    if (allowedUpdates[key] === undefined) delete allowedUpdates[key]
  })
  const blog = await updateBlogByIdForAuthor(id, userId, allowedUpdates);
  if (!blog) {
    throw new Error("Blog not found or You are Not Allowed to update");
  }
  return blog;
};

export const deleteBlog = async (id, userId) => {
  const blog = await deleteBlogByIdForAuthor(id,userId);
  if (!blog) {
    throw new Error("Blog not found");
  }
  return blog;
};

export const getBlogsByCategory = async (category) => {
  if (!category) {
    throw new Error("Category is required");
  }
  return await findBlogsByCategory(category);
};

export const getPublishedBlogs = async () => {
  return await findPublishedBlogs();
};
