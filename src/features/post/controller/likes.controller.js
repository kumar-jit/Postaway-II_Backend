
import { ErrorHandler } from "../../../utils/errorHandler.js";
import { getAllLikesByPostIdRepository, getPostByIdRepository, toggleLikeRepository, } from "../model/likes.repository.js";


export const getLikesOfPost = async (req,res,next) => {
    try{
        const postId = req.params.postId;
        if(!postId) return next(new ErrorHandler(400, "PostId is required"));

        const likes = await getAllLikesByPostIdRepository(postId);
        if(!likes) return next(new ErrorHandler(404, "Post not found"));

        res.status(200).json({
            totalLike:likes.likes.length,
            totalComments:likes.comments.length,
            likes:likes.likes,
            comments:likes.comments
        });
    }
    catch(error){
        next(error);
    }
}

export const toggleLikes = async (req,res,next) => {
    try {
        const postId = req.params.postId;
        if(!postId) return next(new ErrorHandler(400, "PostId is required"));

        const userId = req.userId;
        if(!userId) return next(new ErrorHandler(403, "Please login first"));

        const post = await getPostByIdRepository(postId);
        if (!post) return next(new ErrorHandler(404, "Post not found"));

        const hasLiked = post.likes.includes(userId);

         // Remove like
        if (hasLiked) {
            await toggleLikeRepository(userId,post,true);
            return res.status(200).json({status:true,message:"Like removed successfully"});
        } else {
            // Add like
            await toggleLikeRepository(userId,post,false);
            return res.status(200).json({status:true,message:"Post has been liked"});
        }

    } catch (error) {
        next(error);
    }
}
