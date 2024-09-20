import mongoose from "mongoose";
import { getFriends,getPendingRequest,respondToFriendRequest,toggoleFriendship } from "../controller/frineds.controller.js";
import authenticateURL from "../../../middlewares/jwtAuthorizationMiddleware.js";
import express from "express";

const friendsManagementRouter = express.Router();

friendsManagementRouter.route("/get-friends/:userId").get(authenticateURL,getFriends);
friendsManagementRouter.route("/get-pending-requests").get(authenticateURL,getPendingRequest);
friendsManagementRouter.route("/toggle-friendship/:friendId").post(authenticateURL,toggoleFriendship);
friendsManagementRouter.route("/response-to-request/:friendId").post(authenticateURL,respondToFriendRequest);

export default friendsManagementRouter;