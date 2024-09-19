import { getAllUserRepository, getUserByIdRepository,updateUserRepository } from "./user.repository.js";
import { customErrorHandler } from "../../middlewares/errHandalerMiddleware.js";

export const getUserData = (req,res, next) => {
    try{
        console.log(req);
        res.send("test");
    }
    catch(error){
        next(error)
    }
    
}

export const getUserDetails = async (req,res,next) => {
    try {
        const userId = req.params.userId;
        const user = await getUserByIdRepository(userId);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const getAllUserDetails = async (req,res,next) => {
    try {
        const users = await  getAllUserRepository();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const updateUserDetails = async (req,res,next) => {
    try {
        const userId = req.params.userId;
        const userInformation = req.body;
        if(userId == req.userId ){
            const user = await updateUserRepository(userId,userInformation);
            res.status(200).json(user);
        }
        else
            throw new customErrorHandler("You are not authorize to update this information", 401);  // checks only loging user can own informations
        
    } catch (error) {
        next(error);
    }
}