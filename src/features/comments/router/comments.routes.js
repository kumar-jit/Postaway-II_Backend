import authenticateURL from "../../../middlewares/jwtAuthorizationMiddleware.js";
import express from "express";

import { getAllcomments, addComment, deleteComment, updateComment } from "../controller/comments.controller.js";

const commetnsRouter = express.Router();

commetnsRouter.route("/:postId").get( authenticateURL ,getAllcomments);
commetnsRouter.route("/:postId").post( authenticateURL ,addComment);
commetnsRouter.route("/:commentId").delete( authenticateURL ,deleteComment);
commetnsRouter.route("/:commentId").put( authenticateURL ,updateComment);

export default commetnsRouter;
