import { userModel } from "./users.schema.js";
import { customErrorHandler } from "../../middlewares/errHandalerMiddleware.js";

export const getUserByIdRepository = async (userId) =>{
    const user = await userModel.findById(userId);
    if(!user) {
        throw new customErrorHandler("User not found", 404);
    }
    return user.toJSON();
}

export const getAllUserRepository = async () => {
    const users = await userModel.find({}, '-password -tokens');
    return users;
}

export const updateUserRepository = async(userId,userDetails) => {
    const user = await userModel.findByIdAndUpdate(userId, userDetails, {new: true});
    if(!user){
        throw new customErrorHandler("User not found", 404);
    }
    else{
        return user.toJSON();
    }
}


export const getUserByEmailAndToken = async (userEmail,token) => {
    return await userModel.findOne({email: userEmail, "tokens.token":token });
}