import { ErrorHandler } from "../../../utils/errorHandler.js"
import { createPostRepository, deletePostRepository, getAllPostsRepository, getPostByIdRepository, getUserPostsRepository, updatePostRepository } from "../model/post.repository.js"


export const getAllPosts = async (req, res, next) => {
    try {
        const allPosts = await getAllPostsRepository();
        res.status(200).json(allPosts); 
    } catch (error) {
        next(new ErrorHandler(500,error));
    }
    
}

export const getPostDetails = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        if(!postId) return next(new ErrorHandler(400, "Post ID is required"));

        const post = await getPostByIdRepository(postId);
        if(!post) return next(new ErrorHandler(404, "Post not found"));

        return res.status(200).json(post);
    } catch (error) {
        next(new ErrorHandler(500,error));
    }
}

export const getUserPosts = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if(!userId) return next(new ErrorHandler(400, "User ID is required"));
        const posts = await getUserPostsRepository(userId);
        return res.status(200).json(posts);
    } catch (error) {
        next(new ErrorHandler(500,error));
    }
}

export const addPost = async (req, res, next) => {
    try {
        const {caption,image, owner} = req.body;
        if(!caption){
            return next(new ErrorHandler(400, "Caption is required"));
        }
        const postData = {
            caption: caption,
            image: image || "",
            owner: owner || req.user._id.toString()
        }
        const post = await createPostRepository(postData);
        return res.status(201).json(post);
    } catch (error) {
        next(new ErrorHandler(500, error));
    }
}

export const deletePost = async (req, res, next) => {
    try {
         const postId = req.params.postId;
         if(!postId) return next(new ErrorHandler(400, "Post ID is required"));
         const deletedPost = await deletePostRepository(postId);
         if(!deletedPost) return next(new ErrorHandler(404, "Post not found"));
         res.status(200).json({status:true, message:"Post deleted successfully"});
    } catch (error) {
        next(new ErrorHandler(500, error));
    }
}

export const updatePost = async (req, res, next) => {
    try{
        const postId = req.params.postId;
        if (!postId) return next(new ErrorHandler(400, "Post ID is required"));

        const postLatesData = {};
        if(req.body.caption) postLatesData.caption = req.body.caption;
        if(req.body.image != undefined) postLatesData.image = req.body.image;

        const updatedPost = await updatePostRepository(postId, postLatesData);

        if(!updatePost) return next(new ErrorHandler(404, "Post not found"));
        res.status(200).json(updatedPost);
    }
    catch(error){
        next(new ErrorHandler(500,error));
    }
}
