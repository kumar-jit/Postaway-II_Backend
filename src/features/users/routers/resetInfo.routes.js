

import authenticateURL from "../../../middlewares/jwtAuthorizationMiddleware.js";
import express from "express";

import { sendOtpForEmailChange, sendOtpForPasswordRest, resetPassword, verifyOtpForEmail, verifyOtpForPassword, changeEmail } from "../controller/resetInfo.controller.js";

const resetInfoRouter = express.Router();

resetInfoRouter.route("/send").post(sendOtpForPasswordRest);
resetInfoRouter.route("/verify").post(verifyOtpForPassword);
resetInfoRouter.route("/reset-password").post(resetPassword);

// addtional features
resetInfoRouter.route("/send-email").post(authenticateURL, sendOtpForEmailChange);
resetInfoRouter.route("/verify-email").post(authenticateURL, verifyOtpForEmail);
resetInfoRouter.route("/change-email").post(authenticateURL, changeEmail);


export default resetInfoRouter;