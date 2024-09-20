import { postModel, postSchema } from "./post.schema.js";
import { ObjectId } from 'mongoose';

export const createPostRepository = async (postData) => {
    return await new postModel(postData).save();
}

export const getAllPostsRepository = async () => {
    return await postModel.find(); 
}

// need to change later
export const getPostByIdRepository = async (postId) => {
    return await postModel.findById(postId).populate({path:'owner', select: 'name email avatar'});
}

export const getUserPostsRepository = async (userId) => {
    return await postModel.find({owner: userId});
}

export const updatePostRepository = async (postId, newData) => {
    return await postModel.findByIdAndUpdate(postId, newData, {new: true});
}

export const deletePostRepository = async (postId) => {
    return await postModel.findByIdAndDelete(postId);
}