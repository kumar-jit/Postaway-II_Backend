import { ErrorHandler } from "../../../utils/errorHandler.js";
import {createCommentRepository,deleteCommentRepository,getAllCommentsByPostIdRepository, getCommentByCommentIdRepository, updateCommentReposiotry } from "../model/comments.repository.js"

export const getAllcomments = async (req,res,next) => {
    try{
        const postId = req.params.postId;
        if(!postId) return next(new ErrorHandler(400, "Post ID is required"));
        const comments = await getAllCommentsByPostIdRepository(postId);
        return res.status(200).json(comments);
    }
    catch(error){
        next(error);
    }
}

export const addComment = async (req,res,next) => {
    try {
        const userId = req.user._id.toString();
        const {comment} = req.body;
        if(comment === undefined || comment.trim().length == 0)
            return next(new ErrorHandler(400,"Comment is required"));

        const commentData = {
            comment : comment,
            owner : userId,
            post : req.params.postId
        }
        const result = await createCommentRepository(commentData.post,commentData);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req,res,next) => {
    try {
        const  commentId = req.params.commentId;
        if(!commentId) return next(new ErrorHandler(400, "Comment ID is required"));

        const userId = req.user._id.toString();
        const comment = await getCommentByCommentIdRepository(commentId);
        if(!comment) return next(new ErrorHandler(400,"Comment no longer availabe"));

        // validate authentice user to delete the comment
        // post owner and commnet owner can delete the comment
        if(comment.owner == userId || comment.post.owner == userId) {
            const result = await deleteCommentRepository(commentId,comment);
            return res.status(200).json(result);
        }
        else{
            return next(new ErrorHandler(403,"You are not authorized to delete this comment"));
        }
    } catch (error) {
        next(error);
    }
}

export const updateComment = async (req,res,next) => {
    try {
        const  commentId = req.params.commentId;
        const commentText = req.body.comment;

        if(commentText === undefined || commentText.trim().length == 0)
            return next(new ErrorHandler(400,"Comment ID is required"));

        if(!commentId) return next(new ErrorHandler(400, "Comment ID is required"));     // parameter check

        const userId = req.user._id.toString();
        const comment = await getCommentByCommentIdRepository(commentId); // get thec comment to verify user
        if(!comment) return next(new ErrorHandler(400,"Comment no longer availabe"));

        if(comment.owner != userId) return next(new ErrorHandler(403,"You are not authorized to update this comment"));

        const result = await updateCommentReposiotry(commentId, {comment: commentText});
        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}   