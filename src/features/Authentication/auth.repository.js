
import { userModel, userSchema } from "../users/users.schema.js"
import { customErrorHandler } from "../../middlewares/errHandalerMiddleware.js";

// user signup repository
export const userSignupRepository = async (userData) =>{

    const newUser = new userModel(userData);
    await newUser.encryptPassword();
    await newUser.save();
    return { success: true, res: newUser.toJSON() };
}

// user login repo
export const userLoginRepository = async (userCredential) => {
    const {email, password} = userCredential;
    try {
        const user = await userModel.findOne({email: email});
        if (!user) {
            return { success: false, error: { statusCode: 401, msg: "Invalid userID or email!"}};
        }
        else{
            const isValidPassword = await user.isPasswordMatch(password);
            if(!isValidPassword){
                return { success: false, error: { statusCode: 401, msg: "Invalid Password!"}};
            }
            else{
                const token = await user.generateAuthToken();
                return { success: true, res: { token : token, user : user.toJSON() } };
            }
        }
    } catch (error) {
        if(error instanceof customErrorHandler){
            throw new customErrorHandler(error.message,error.status);
        }
        else{
            return { success: false, error: { statusCode: 500, msg: error.message} };
        }
    }
}

export const logoutRepository = async (userId, token) => {
    try {
        const res = await userModel.findOneAndUpdate({_id: userId },{$pull:{ tokens : {token : token}}});
        if(res){
            return { success: true, res: { msg: "logout successful!" } };
        }
        else{
            return { success: false, error: {statusCode:400, msg: "User not found" } };
        }
    } catch (error) {
        throw new customErrorHandler(error.message,error.status);
    }
}

export const logoutAllDeviceRepossitory = async (userId) => {
    try {
        const res = await userModel.findOneAndUpdate({_id: userId },{$set: { tokens: [] } });
        if(res){
            return { success: true, res: { msg: "logout successful!" } };
        }
        else{
            return { success: false, error: {statusCode:400, msg: "User not found" } };
        }
    } catch (error) {
        throw new customErrorHandler(error.message,error.status);
    }
}