import express from "express";
import { signin, signup, logout, logoutAllDevices } from "../Authentication/auth.controller.js";
import { getAllUserDetails,getUserDetails,updateUserDetails } from "./user.controller.js";
import authenticateURL from "../../middlewares/jwtAuthorizationMiddleware.js";

const userRouter = express.Router();


userRouter.route("/signup").post(signup);
userRouter.route("/signin").post(signin);
userRouter.route("/logout").post(authenticateURL, logout);
userRouter.route("/logout-all-devices").post(authenticateURL, logoutAllDevices);

userRouter.route("/get-details/:userId").get(authenticateURL, getUserDetails);
userRouter.route("/get-all-details").get(authenticateURL, getAllUserDetails);
userRouter.route("/update-details/:userId").put(authenticateURL, updateUserDetails);

// userRouter.route("/test").get(authenticateURL,getUserData);
export default userRouter;

