import jwt from 'jsonwebtoken';
import { getUserByEmailAndToken } from '../features/users/user.repository.js';
import { customErrorHandler,globalErrorHandaler } from './errHandalerMiddleware.js';

export const authenticateURL = async (req, res, next) => {
    try {
        const jwtToken = req.headers.authorization.substring(7);
        if(!jwtToken){
            return res.status(401).json({message: 'Unauthorized! Please login again'});
        }
        const screatKey = process.env.JWT_SECRET;
        jwt.verify(jwtToken, screatKey, async (err, decoded) => {
            if (err) res.status(401).json({ success: false, msg: "Faild to login! Please try again" });
            else {
                const userPayload = decoded;
                req.userId = userPayload._id;
                req.userEmail = userPayload.email;
                req.jwtToken = jwtToken;
                let userMetadata = await getUserByEmailAndToken(userPayload.email, jwtToken);
                if (!userMetadata) {
                    return res.status(401).json({message: 'Please login again!'});
                }
                next();
            }
        })
    } catch (error) {
        // next(error);
        globalErrorHandaler(error, req, res, next);
    }
}

export default authenticateURL;