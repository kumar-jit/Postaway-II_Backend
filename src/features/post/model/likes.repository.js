import { postModel } from "./post.schema.js";

export const getAllLikesByPostIdRepository = async (postId) => {
    return await postModel.findById(postId)
        .select(['likes', 'comments'])
        .populate({ path: 'likes', select: 'name' }) // Populate likes with user names
        .populate({ 
            path: 'comments', 
            select: 'comment owner', // Select comment and owner fields
            populate: { path: 'owner', select: 'name' } // Populate owner with user name
        });
}

export const getPostByIdRepository = async(postId) => {
    return await postModel.findById(postId);
}

export const toggleLikeRepository = async (userId,post,action) => {
    if(action) {
        // Remove like
        post.likes.pull(userId);
    } else {
        // Add like
        post.likes.push(userId);
    }
    return await post.save();
}