import { postModel, postSchema } from "./post.schema.js";
import { userModel, userSchema } from "../users/users.schema.js";


export const createPost = async (postData) => {
    return await new postModel(postData).save();
}

export const getAllPosts = async () => {
    return await postModel.find(); 
}

export const getPostById = async (postId) => {
    return await postModel.findById(postId).populate('user').populate('comments').populate('likes');
}

export const getUserPosts = async (userId) => {
    return await postModel.find({owner: new ObjectId(userId)});
}

export const updatePost = async (postId, newData) => {
    return await postModel.findByIdAndUpdate(postId, newData, {new: true});
}

export const deletePost = async (postId) => {
    return await postModel.findByIdAndDelete(postId);
}