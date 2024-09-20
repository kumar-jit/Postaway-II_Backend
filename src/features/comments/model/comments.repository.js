import { commentModel } from "./comments.schema.js";
import { postModel } from "../../post/model/post.schema.js";
import mongoose from "mongoose";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const createCommentRepository = async(postId,commentData) => {
    const session = await mongoose.startSession();  // Start a new session
    session.startTransaction();  // Start the transaction

    try {
        // Step 1: Create and save the comment
        const newComment = new commentModel(commentData);
        await newComment.save({ session });  // Save the comment within the transaction

        // Step 2: Find the post and push the comment ID
        const post = await postModel.findById(postId).session(session);  // Use session to fetch post inside the transaction
        if (!post) {
            throw new ErrorHandler(404, "Post not found");
        }
        post.comments.push(newComment._id);
        await post.save({ session });  // Save the post with the updated comments array inside the transaction

        // Step 3: Commit the transaction
        await session.commitTransaction();
        session.endSession();  // End the session after committing

        return newComment;

    } catch (error) {
        // Step 4: Abort the transaction in case of an error
        await session.abortTransaction();
        session.endSession();  // End the session after aborting

        throw error;  // Rethrow the error to be handled by the caller
    }
}

export const getAllCommentsByPostIdRepository = async(postId) => {
    return await commentModel.find({post:postId}).populate({path:'owner', select:'name email'});
}

export const deleteCommentRepository = async(commentId,comment) => {
   const session = await mongoose.startSession();
   session.startTransaction();

   try {
        // Step 1: Find the comment to get PostId
        if(!comment)
            comment = await commentModel.findById(commentId).session(session);
        if (!comment) throw new ErrorHandler(400, "Comment no longer availabe");

        // Step 2: delete the comment from the post if post is exsist
        const postId = comment.post;
        await postModel.findByIdAndUpdate(
            postId,
            { $pull: { comments: commentId } },  // $pull removes the commentId from the comments array
            { new: true }
        ).session(session);  // Ensure the update is within the session
        // not checking for post exsist or not, because if post not exsist its fine
        // because we are using $pull operator which will not throw any error if the field is not
        
        // Step 3: Delete the comment
        await commentModel.findByIdAndDelete(commentId).session(session);

         // Step 3: Commit the transaction
         await session.commitTransaction();
         session.endSession();  // End the session after committing
 
         return { success: true, message: "Comment deleted successfully" };

   } catch (error) {
        // Step 4: Abort the transaction in case of an error
        await session.abortTransaction();
        session.endSession();  // End the session after aborting
        throw error;  // Rethrow the error to be handled by the caller
   }
}

export const getCommentByCommentIdRepository = async (commentId) =>{
    return await commentModel.findById(commentId).populate({path:"post", select:"owner"});
}

export const updateCommentReposiotry = async (commentId,commentData) => {
    return await commentModel.findByIdAndUpdate(commentId, commentData, {new:true});
}