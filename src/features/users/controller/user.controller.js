import { getAllUserRepository, getUserByIdRepository,updateUserRepository } from "../model/user.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const getUserDetails = async (req,res,next) => {
    try {
        const userId = req.params.userId;
        const user = await getUserByIdRepository(userId);
        if(!user) {
            return next(new ErrorHandler(404, "User not found"));
        }
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const getAllUserDetails = async (req,res,next) => {
    try {
        const users = await  getAllUserRepository();
        res.status(200).json(users);
    } catch (error) {
        next(new ErrorHandler(500, error));
    }
}

export const updateUserDetails = async (req,res,next) => {
    try {
        const userId = req.params.userId;
        const userInformation = req.body;
        if(userId == req.userId ){
            const user = await updateUserRepository(userId,userInformation);
            if(user)
                res.status(200).json(user);
            else
                return next(new ErrorHandler(404, "User not found"));
        }
        else
           return next(new ErrorHandler(403, "You do not have permission to update this user's information"))
        
    } catch (error) {
        next(new ErrorHandler(500, error));
    }
}