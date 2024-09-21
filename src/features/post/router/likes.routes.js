import authenticateURL from "../../../middlewares/jwtAuthorizationMiddleware.js";
import express from 'express';
import { getLikesOfPost,toggleLikes } from "../controller/likes.controller.js";

const likesRouter = express.Router();

likesRouter.route("/:postId").get(authenticateURL, getLikesOfPost);
likesRouter.route("/toggle/:postId").post(authenticateURL,toggleLikes);

export default likesRouter;