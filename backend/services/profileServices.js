import { findUserById, findUserByIdAndUpdate, findUserByIdWithPassword } from "../repositories/userRepositories.js"
import { findPublishedBlogsByAuthor } from "../repositories/blogRepositories.js"
import bcrypt from 'bcrypt'

export const getUserProfile = async(userId)=>{
    const user = await findUserById(userId)

    if(!user){
        throw new Error("User not Found!!")
    }
    return user
}

export const getPublicAuthorProfile = async (authorId) => {
    const author = await findUserById(authorId);
    if (!author) {
        throw new Error("Author not found");
    }
    const blogs = await findPublishedBlogsByAuthor(authorId);
    return {
        author,
        blogs,
    };
};

export const updateUserProfile = async(userId,updates)=> {
    const allowedUpdates = {}
    if(updates.name){
        allowedUpdates.name = updates.name
    }
    if(updates.bio){
        allowedUpdates.bio = updates.bio
    }
    if(updates.description){
        allowedUpdates.description = updates.description
    }
    if(updates.profileImage){
        allowedUpdates.profileImage = updates.profileImage
    }
    if(updates.writingCategory){
        allowedUpdates.writingCategory = updates.writingCategory
    }

    const updatedUser = await findUserByIdAndUpdate(userId,allowedUpdates)

    if(!updatedUser){
        throw new Error("user not found")
    }
    return updatedUser;
} 

export const changeUserPassword = async(userId,oldPassword,newPassword) => {
    const user = await findUserByIdWithPassword(userId)
    if(!user){
        throw new Error("user not found")
    }

    const isMatch = await bcrypt.compare(oldPassword,user.password)
    if(!isMatch){
        throw new Error("Old password Incorrect")
    }
    const hashedPassword = await bcrypt.hash(newPassword,10)

    const updatedUser = await findUserByIdAndUpdate(userId,{password: hashedPassword})

    return updatedUser;
}