
import { createPost, deletePost, getAllPosts, getPostById, getUserPosts, updatePost } from "./post.repository"


export const getAllPost = async (req, res, next) => {
    
    
}

export const getPostDetails = async (req, res, next) => {

}

export const getUserPosts = async (req, res, next) => {

}

export const addPost = async (req, res, next) => {
    try {
        const {caption,image, owner} = req.body;
        const postData = {
            caption: caption,
            image: image,
            owner: owner || req.userId
        }
        const post = await createPost(postData);
        if(!post){
            
        }
    } catch (error) {
        
    }
}

export const deletePost = async (req, res, next) => {

}

export const updatePost = async (req, res, next) => {

}
