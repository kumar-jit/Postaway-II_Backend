import { postModel, postSchema } from "./post.schema.js";


export const createPostRepository = async (postData) => {
    return await new postModel(postData).save();
}

export const getAllPostsRepository = async () => {
    return await postModel.find(); 
}

export const getPostByIdRepository = async (postId) => {
    return await postModel.findById(postId).populate('user').populate('comments').populate('likes');
}

export const getUserPostsRepository = async (userId) => {
    return await postModel.find({owner: new ObjectId(userId)});
}

export const updatePostRepository = async (postId, newData) => {
    return await postModel.findByIdAndUpdate(postId, newData, {new: true});
}

export const deletePostRepository = async (postId) => {
    return await postModel.findByIdAndDelete(postId);
}