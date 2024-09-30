import otpGenerator from "../../../utils/otpGenerator.js";

export const saveOTPRepository = async(userObject, actionType) =>{
    const otp = otpGenerator();
    const timeStamp = new Date(Date.now() + 10 * 60 * 1000);
    
    if(actionType == "email"){
        userObject.otpEmail = otp;
        userObject.otpEmailExpiry = timeStamp;
    }
    else {
        userObject.otp = otp;
        userObject.otpExpiry = timeStamp;
    }
    
    return await userObject.save();
}


export const updateUserPasswordRepository = async(userObject) =>{
    await userObject.encryptPassword();
    userObject.otp = null;
    userObject.otpExpiry = null;
    const user = await userObject.save();
    return (user)? user.toJSON() : undefined;
}
