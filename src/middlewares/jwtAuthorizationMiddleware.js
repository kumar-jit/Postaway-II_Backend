import jwt from 'jsonwebtoken';
import { getUserByEmailAndToken } from '../features/users/model/user.repository.js';
import { errorHandlerMiddleware } from './errHandalerMiddleware.js';
import { ErrorHandler } from '../utils/errorHandler.js';

import redisServer from '../utils/redisServer.js';

export const authenticateURL = async (req, res, next) => {
    try {
        if(!req.headers.authorization) return next(new ErrorHandler(403, "Please login first"));
        const jwtToken = req.headers.authorization.substring(7);
        if(!jwtToken){
            return next(new ErrorHandler(403, 'Unauthorized! Please login again'))
        }
        const screatKey = process.env.JWT_SECRET;
        jwt.verify(jwtToken, screatKey, async (err, decoded) => {
            if (err) return next(new ErrorHandler(401, "Not a valid session"))
            else {
                const userPayload = decoded;
                req.userId = userPayload._id;
                req.userEmail = userPayload.email;
                req.jwtToken = jwtToken;

                let userMetadata = redisServer.getUserByEmailAndToken(userPayload.email, jwtToken);
                if (!userMetadata) {
                    const userRawDetails = await getUserByEmailAndToken(userPayload.email, jwtToken);
                    userMetadata = userRawDetails.toObject();

                    redisServer.saveUserByEmail(userPayload.email, userMetadata);
                }
                req.user = userMetadata;

                // let userMetadata = await getUserByEmailAndToken(userPayload.email, jwtToken);
                if (!userMetadata) {
                    return next(new ErrorHandler(401, "Not a valid session. Please login again"));
                }
                next();
            }
        })
    } catch (error) {
        // next(error);
        errorHandlerMiddleware(error, req, res, next);
    }
}

export default authenticateURL;