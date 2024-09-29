import { ErrorHandler } from "../../../utils/errorHandler.js";
import sendMail from "../../../utils/email/mailSender.js";
import { getUserByEmailRepository } from '../../users/model/user.repository.js';
import { saveOTPRepository, updateUserPasswordRepository } from "../model/resetInfo.repository.js";


export const sendOTP = async(req,res,next) => {

    try{
        const email = req.body.email;

        // Ensure email is provided
        if (!email) return next(new ErrorHandler(400, "Email is required"));

        const user = await getUserByEmailRepository(email,true);
        if(!user) return next(new ErrorHandler(404,"No user found with this email. Please sign up."));

        const updatedUser = await saveOTPRepository(user);
        if(!updatedUser) return next(new ErrorHandler(500,"Something went wrong. Please try again later."));

        sendMail(updatedUser.name, updatedUser.email, updatedUser.otp, "password");

        return res.status(200).send({status:true,msg:"Please check your email for the OTP"})
    }
    catch(error){
        next(error);
    }

}

export const verifyOTP = async(req,res,next) => {
    try {
        const { email, otp } = req.body;
        
        if(!email) return next(new ErrorHandler(400, "Email is required"));
        if(!otp) return next(new ErrorHandler(400, "OTP is required"));

        // Fetch OTP and expiry from the repository
        const user = await getUserByEmailRepository(email,true);
        if (!user) return next(new ErrorHandler(404, "User not found"));
    
        // Check if OTP matches
        if (user.otp != otp) return next(new ErrorHandler(400, "Invalid OTP"));
    
        // Check if OTP has expired
        const currentTime = new Date();
        if (user.otpExpiry < currentTime) return next(new ErrorHandler(400, "OTP has expired"));
    
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

export const sendOtpForEmail = async (req,res,next) => {
    
}
export const changeEmail = async(req,res,next) => {
    
}