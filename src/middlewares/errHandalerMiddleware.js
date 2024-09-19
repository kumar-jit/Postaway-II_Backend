import { logger } from "./loggingMiddlware.js";


export class customErrorHandler extends Error{
    constructor(message, status) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}
export const globalErrorHandaler = (error, req, res, next) => {
    let message = "";
    if(error instanceof customErrorHandler){
        message = `${error.message || "server error! Try later!!" } , requestUrl : ${req.originalUrl}`; 
        res.status(error.status).json( { msg : error.message});
    }
    else{
        message = `${error.message || "server error! Try later!!" } , requestUrl : ${req.originalUrl}`; 
        res.status(500).json({ msg : error.message});
    }
    logger.error(message);
    next();
}