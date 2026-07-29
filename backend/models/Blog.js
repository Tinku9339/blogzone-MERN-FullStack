import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    isPublished:{
        type:Boolean,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    }

},{timestamps:true})
const Blog = mongoose.model('Blog',blogSchema)

export default Blog;