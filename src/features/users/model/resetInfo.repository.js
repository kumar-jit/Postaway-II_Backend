import otpGenerator from "../../../utils/otpGenerator.js";

export const saveOTPRepository = async(userObject) =>{
    userObject.otp = otpGenerator();
    userObject.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    return await userObject.save();
}

export const updateUserPasswordRepository = async(userObject) =>{
    await userObject.encryptPassword();
    userObject.otp = null;
    userObject.otpExpiry = null;
    const user = await userObject.save();
    return (user)? user.toJSON() : undefined;
}
