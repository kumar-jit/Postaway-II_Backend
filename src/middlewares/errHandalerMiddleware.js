import { logger } from "./loggingMiddlware.js";


export class customErrorHandler extends Error{
    constructor(message, status) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}
// export const globalErrorHandaler = (error, req, res, next) => {
//     let message = "";
//     if(error instanceof customErrorHandler){
//         message = `${error.message || "server error! Try later!!" } , requestUrl : ${req.originalUrl}`; 
//         res.status(error.status).json( { msg : error.message});
//     }
//     else{
//         message = `${error.message || "server error! Try later!!" } , requestUrl : ${req.originalUrl}`; 
//         res.status(500).json({ msg : error.message});
//     }
//     logger.error(message);
//     next();
// }

import { ErrorHandler } from "../utils/errorHandler.js";

export const errorHandlerMiddleware = (err, req, res, next) => {

    let message = `${err.message || "server error! Try later!!" } , requestUrl : ${req.originalUrl}`; 
    logger.error(message);
    
    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({ success: false, error: err.message });
};

// handling handleUncaughtError  Rejection
export const handleUncaughtError = () => {
    process.on("uncaughtException", (err) => {
        console.log(`Error: ${err}`);
        console.log("shutting down server bcz of uncaughtException");
    });
};