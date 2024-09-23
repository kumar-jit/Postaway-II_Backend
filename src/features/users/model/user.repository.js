import { userModel } from "./users.schema.js";

export const getUserByIdRepository = async (userId, sharePassword = false) =>{
    const user = await userModel.findById(userId);
    if(sharePassword)
        return user;
    else
        return (user)? user.toJSON() : undefined;
}

export const getAllUserRepository = async (sharePassword = false) => {
    if(sharePassword)
        return await userModel.find({});
    else
        return await userModel.find({}, '-password -tokens -otp');
}

export const updateUserRepository = async(userId,userDetails, sharePassword = false) => {
    const user = await userModel.findByIdAndUpdate(userId, userDetails, {new: true});
    if(sharePassword)
        return user;
    else
        return (user)? user.toJSON() : undefined;
}

export const getUserByEmailRepository = async(userEmail, sharePassword = false) => {
    const user = await userModel.findOne({email: userEmail});
    if(sharePassword)
        return user;
    else
        return (user)? user.toJSON() : undefined;
}

export const getUserByEmailAndToken = async (userEmail,token) => {
    return await userModel.findOne({email: userEmail, "tokens.token":token });
}