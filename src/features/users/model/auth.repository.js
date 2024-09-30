
import { userModel } from "./users.schema.js"
import redisServer from "../../../utils/redisServer.js";

// user signup repository
export const userSignupRepository = async (userData) =>{

    const newUser = new userModel(userData);
    await newUser.encryptPassword();
    await newUser.save();
    return (newUser)? newUser.toJSON() : undefined;
}

// user login repo
export const userLoginRepository = async (userObject) => {
    const token = await userObject.generateAuthToken();
    return (token)? {token:token, user:userObject.toJSON()} : undefined;
}

export const logoutRepository = async (userId, token, email) => {
    redisServer.deleteSingleTokenByEmail(email, token);
    return await userModel.findOneAndUpdate({_id: userId },{$pull:{ tokens : {token : token}}});
}

export const logoutAllDeviceRepossitory = async (userId, email) => {
    redisServer.removeUserByEmail(email);
    return await userModel.findOneAndUpdate({_id: userId },{$set: { tokens: [] } });
}