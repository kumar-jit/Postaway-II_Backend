

import authenticateURL from "../../../middlewares/jwtAuthorizationMiddleware.js";
import express from "express";

import { sendOTP, resetPassword, verifyOTP, changeEmail } from "../controller/resetInfo.controller.js";

const resetInfoRouter = express.Router();

resetInfoRouter.route("/send").post(sendOTP);
resetInfoRouter.route("/verify").post(verifyOTP);
resetInfoRouter.route("/reset-password").post(resetPassword);
resetInfoRouter.route("/change-email").post(authenticateURL, changeEmail);


export default resetInfoRouter;