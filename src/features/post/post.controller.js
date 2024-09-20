
import { ErrorHandler } from "../../utils/errorHandler.js"
import { createPostRepository, deletePostRepository, getAllPostsRepository, getPostByIdRepository, getUserPostsRepository, updatePostRepository } from "./post.repository.js"


export const getAllPosts = async (req, res, next) => {
    try {
        const allPosts = await getAllPostsRepository();
        res.status(200).json(allPosts); 
    } catch (error) {
        next(new ErrorHandler(500,error));
    }
    
}

export const getPostDetails = async (req, res, next) => {

}

export const getUserPosts = async (req, res, next) => {

}

export const addPost = async (req, res, next) => {
    try {
        const {caption,image, owner} = req.body;
        if(!caption){
            return next(new ErrorHandler(401,"Caption is require"));
        }
        const postData = {
            caption: caption,
            image: image || "",
            owner: owner || req.userId
        }
        const post = await createPostRepository(postData);
        return res.status(201).json(post);
    } catch (error) {
        next(new ErrorHandler(500, error));
    }
}

export const deletePost = async (req, res, next) => {

}

export const updatePost = async (req, res, next) => {

}
