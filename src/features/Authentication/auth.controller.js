import { userModel } from "../users/users.schema.js";
import { userSignupRepository, userLoginRepository, logoutRepository,logoutAllDeviceRepossitory } from "./auth.repository.js";


export const signup = async (req,res,next) => {
    try {
        const {name, email, password, avatar, gender} = req.body;
        const userData = {
            name: name,
            email: email,
            password: password,
            avatar: avatar,
            gender: gender
        }
        const result = await userSignupRepository(userData);
        if(result.success){
            res.status(201).json(result.res);
        }
        else{
            res.status(result.error.statusCode).json(result.error.msg);
        }
    } catch (error) {
        next(error);
    }
}

export const signin = async (req,res,next) =>{
    const token = process.env.JWT_SECRET
    try {
        const result = await userLoginRepository(req.body);
        if(!result.success){
            res.status(result.error.statusCode).json({message: result.error.msg});
        }
        else{
            // let userId = "test"
            // res
            // .status(201)
            // .cookie("userId", userId, { maxAge: 900000, httpOnly: true})  // Secure should be true in production with HTTPS
            // .json({ status: "success", msg: "Login successful" });
            res.status(200).json(result.res);
        }
    } catch (error) {
        next(error);
    }
}

export const logout = async (req,res,next) =>{
    try {
        const userId = req.userId,
              token = req.jwtToken;
        const result = await logoutRepository(userId,token);
        if(result.success){
            res.status(200).json(result.res);
        }
        else{
            res.status(result.error.statusCode).json(result.error.msg);
        }
    } catch (error) {
        next(error);
    }
    
    
}

export const logoutAllDevices = async(req,res,next) => {
    try {
        const userId = req.userId,
              token = req.jwtToken;
        const result = await logoutAllDeviceRepossitory(userId,token);
        if(result.success){
            res.status(200).json(result.res);
        }
        else{
            res.status(result.error.statusCode).json(result.error.msg);
        }
    } catch (error) {
        next(error);
    }
}

