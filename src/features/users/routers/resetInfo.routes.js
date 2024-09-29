

import authenticateURL from "../../../middlewares/jwtAuthorizationMiddleware.js";
import express from "express";

import { sendOTP, resetPassword, verifyOTP, changeEmail } from "../controller/resetInfo.controller.js";

const resetInfoRouter = express.Router();

resetInfoRouter.route("/send").post(sendOTP);
resetInfoRouter.route("/verify").post(verifyOTP);
resetInfoRouter.route("/reset-password").post(resetPassword);

// addtional features
resetInfoRouter.route("/send-email").post(authenticateURL, changeEmail);
resetInfoRouter.route("/verify-email").post(authenticateURL, changeEmail);
resetInfoRouter.route("/change-email").post(authenticateURL, changeEmail);


export default resetInfoRouter;