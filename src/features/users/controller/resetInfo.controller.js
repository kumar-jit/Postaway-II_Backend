import { ErrorHandler } from "../../../utils/errorHandler.js";
import sendMail from "../../../utils/email/mailSender.js";
import { getUserByEmailRepository, getUserByIdRepository, updateUserRepository } from '../../users/model/user.repository.js';
import { saveOTPRepository, updateUserPasswordRepository } from "../model/resetInfo.repository.js";


export const sendOtpForPasswordRest = async ( req, res, next) => {
    await sendOTP(req, res, next, "password");
}
export const sendOtpForEmailChange = async ( req, res, next) => {
    req.body.email = req.user.email;    // adding email to req body
    await sendOTP(req, res, next, "email");
}

export const verifyOtpForEmail = async (req, res, next) =>{
    req.body.email = req.user.email;    // adding email to req body
    await verifyOTP(req,res,next, "email");
}
export const verifyOtpForPassword = async (req, res, next) => {
    await verifyOTP(req,res,next, "password");
}

const sendOTP = async(req,res,next, actionType) => {
    try{
        const email = req.body.email;

        // Ensure email is provided
        if (!email) return next(new ErrorHandler(400, "Email is required"));

        const user = await getUserByEmailRepository(email,true);
        if(!user) return next(new ErrorHandler(404,"No user found with this email. Please sign up."));

        const updatedUser = await saveOTPRepository(user, actionType);
        if(!updatedUser) return next(new ErrorHandler(500,"Something went wrong. Please try again later."));

        // fetching otp
        let otp = (actionType == "email")? updatedUser.otpEmail : updatedUser.otp;

        sendMail(updatedUser.name, updatedUser.email, otp, actionType);

        return res.status(200).send({status:true,msg:"Please check your email for the OTP"})
    }
    catch(error){
        next(error);
    }
}

const verifyOTP = async(req,res,next, actionType) => {
    try {
        const { email, otp } = req.body;
        
        if(!email) return next(new ErrorHandler(400, "Email is required"));
        if(!otp) return next(new ErrorHandler(400, "OTP is required"));

        // Fetch OTP and expiry from the repository
        const user = await getUserByEmailRepository(email,true);
        if (!user) return next(new ErrorHandler(404, "User not found"));

        if(actionType == "email"){
            // Check if OTP matches
            if (user.otpEmail != otp) return next(new ErrorHandler(400, "Invalid OTP"));
        
            // Check if OTP has expired
            const currentTime = new Date();
            if (user.otpEmailExpiry < currentTime) return next(new ErrorHandler(400, "OTP has expired"));
        }
        else{
            // Check if OTP matches
            if (user.otp != otp) return next(new ErrorHandler(400, "Invalid OTP"));
        
            // Check if OTP has expired
            const currentTime = new Date();
            if (user.otpExpiry < currentTime) return next(new ErrorHandler(400, "OTP has expired"));
        }
        
        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async(req,res,next) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        if(!email) return next(new ErrorHandler(400, "Email is required"));
        if(!otp) return next(new ErrorHandler(400, "OTP is required"));
        if(!newPassword) return next(new ErrorHandler(400, "Password is required"));

        // Fetch OTP and expiry
        const user = await getUserByEmailRepository(email,true);
        if (!user) return next(new ErrorHandler(404, "User not found"));
    
        // Check if OTP matches and hasn't expired
        const currentTime = new Date();
        if (user.otp != otp) return next(new ErrorHandler(400, "Invalid OTP"));
        if (user.otpExpiry < currentTime) return next(new ErrorHandler(400, "OTP has expired"));
    
        // Encrypt new password and clear the OTP and expiry
        user.password = newPassword;
        const updatedUser = await updateUserPasswordRepository(user);

        if(!updatedUser) return next(new ErrorHandler(500, "Something went wrong"));

        return res.status(200).json({ message: "Password reset successfully" });

      } catch (error) {
        next(error);
      }
}

export const changeEmail = async(req,res,next) => {
    try {
        const newEmail = req.body.newEmail;
        const userId = req.user._id.toString();

        if(!userId) return next(new ErrorHandler(403, "Please login again"))
        if(!newEmail) return next(new ErrorHandler(400, "Email is required"));

        const updatedUser = await updateUserRepository(userId, {email: newEmail});

        if(!updatedUser) return next(new ErrorHandler(404, "User not found"));

        res.status(200).json({ message: "Email change successfully" });
    }
    catch(error) {
        next(error);
    }
}