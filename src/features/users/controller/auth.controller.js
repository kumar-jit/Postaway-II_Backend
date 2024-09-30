import { ErrorHandler } from "../../../utils/errorHandler.js";
import { getUserByEmailRepository } from "../model/user.repository.js";

import { userSignupRepository, userLoginRepository, logoutRepository,logoutAllDeviceRepossitory } from "../model/auth.repository.js";


export const signup = async (req,res,next) => {
    try {
        const {name, email, password, avatar, gender} = req.body;

        // Validate required fields
        if (!email) return next(new ErrorHandler(401, "Email is required"));
        if (!name) return next(new ErrorHandler(401, "Name is required"));
        if (!password) return next(new ErrorHandler(401, "Password is required"));
        if (!gender) return next(new ErrorHandler(401, "Gender is required"));

        const userData = {
            name: name,
            email: email,
            password: password,
            avatar: avatar,
            gender: gender
        }
        const result = await userSignupRepository(userData);
        if(!result) return next( new ErrorHandler(400, "Failed to create user") );
        res.status(201).json({message: "User created successfully",result});
    } catch (error) {
        next(error);
    }
}

export const signin = async (req,res,next) =>{
    try {
        const {email, password} = req.body;

        // Validate required fields
        if (!email) return next(new ErrorHandler(400, "Email is required"));
        if (!password) return next(new ErrorHandler(400, "Password is required"));

        const user = await getUserByEmailRepository(email,true);
        if(!user) return next(new ErrorHandler(400, "No account found with this email. Please sign up. "));

        const isValidPassword = await user.isPasswordMatch(password);
        if(!isValidPassword) return next(new ErrorHandler(401, "Invalid Password!"));

        const result = await userLoginRepository(user);

        if(!result) return next( new ErrorHandler(400, "Failed to login") );

        res.status(200).json({message: "User logged in successfully", result});

    } catch (error) {
        next(error);
    }
}

export const logout = async (req,res,next) =>{
    try {
        const userId = req.user._id.toString(),
              token = req.jwtToken;
        
        // check login status
        if(!userId) return res.status(200).json({message:"Already logged out successfully!"});

        const result = await logoutRepository(userId,token, req.user.email);
        if(!result) return next(new ErrorHandler(500,"Something went wrong"));

        res.status(200).json({message:"Logout successful!" })

    } catch (error) {
        next(error);
    }
    
    
}

export const logoutAllDevices = async(req,res,next) => {
    try {
        const userId = req.user._id.toString(),
              token = req.jwtToken;

        // check login status
        if(!userId) return res.status(200).json({message:"Already logged out successfully!"});

        const result = await logoutAllDeviceRepossitory(userId, req.user.email);
        if(!result) return next(new ErrorHandler(500,"Something went wrong."));

        res.status(200).json({message:"Logout successful from all devices!" })

    } catch (error) {
        next(error);
    }
}

