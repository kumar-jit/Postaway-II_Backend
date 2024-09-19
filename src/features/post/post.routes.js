import { addPost, getAllPost, getPostDetails, getUserPosts, deletePost, updatePost } from './post.controller.js';
import authenticateURL from "../../middlewares/jwtAuthorizationMiddleware.js";
import express from 'express';


export const postRouter = express.Router();

postRouter.route("/all").get(authenticateURL,getAllPost);
postRouter.route("/:postId").get(authenticateURL,getPostDetails);
postRouter.route("/user/:userId").get(authenticateURL,getUserPosts);
postRouter.route("/").post(authenticateURL,addPost);
postRouter.route("/:postId").delete(authenticateURL,deletePost);
postRouter.route("/:postId").get(authenticateURL,updatePost);

export default postRouter;
