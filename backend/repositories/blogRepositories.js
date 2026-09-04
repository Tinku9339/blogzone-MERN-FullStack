import Blog from '../models/Blog.js'

export const findAllBlogs = async (filter = {}, projection = null, options = {}) => {
    return await Blog.find(filter, projection, options).populate('author', 'name profileImage bio')
}
export const findBlogsByAuthor = async (authorId) => {
    return await Blog.find({author: authorId}).sort({createdAt: -1})
}
export const findBlogById = async (id) => {
    return await Blog.findById(id).populate('author', 'name profileImage bio description')
}

export const createBlog = async (blogData) => {
    return await Blog.create(blogData)
}
export const findBlogByIdForAuthor = async (id, authorId) => {
    return await Blog.findOne({_id: id, author: authorId })
}

export const updateBlogByIdForAuthor = async (id, authorId, updates) => {
    return await Blog.findOneAndUpdate({_id: id, author: authorId}, updates, { new: true, runValidators: true })
}

export const deleteBlogByIdForAuthor = async (id, authorId) => {
    return await Blog.findOneAndDelete({_id: id, author: authorId})
}

export const findBlogsByCategory = async (category) => {
    return await Blog.find({ category, isPublished: true }).populate('author', 'name profileImage bio').sort({createdAt: -1})
}

export const findPublishedBlogs = async () => {
    return await Blog.find({ isPublished: true }).populate('author', 'name profileImage bio').sort({createdAt: -1})
}

export const findPublishedBlogsByAuthor = async (authorId) => {
    return await Blog.find({ author: authorId, isPublished: true })
        .populate('author', 'name profileImage bio')
        .sort({ createdAt: -1 })
}

export const toggleLikeBlog = async (blogId, userId) => {
    const blog = await Blog.findById(blogId)
    if (!blog) return null

    const hasLiked = blog.likes.some((id) => id.toString() === userId.toString())
    if (hasLiked) {
        blog.likes = blog.likes.filter((id) => id.toString() !== userId.toString())
    } else {
        blog.likes.push(userId)
    }
    blog.likesCount = blog.likes.length
    await blog.save()
    return blog
}