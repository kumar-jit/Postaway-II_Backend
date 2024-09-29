import nodemailer from 'nodemailer'
import { logger } from '../../middlewares/loggingMiddlware.js';
import { ErrorHandler } from '../errorHandler.js';
import getHtmlCode from './emailHtml.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: 'jitmaity1999@gmail.com',
    pass: 'byuvpvhsqcnpdidu'
  },
});

const sendMail = async (userName,userEmail,otp,changeType) => {
    try {
          // send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'mark@facebook.com', // sender address
            to: userEmail, // list of receivers
            subject: "OTP Verification", // Subject line
            html: getHtmlCode(userName,otp,changeType), // html body
        });

        logger.info(info);

    } catch (error) {
        // logger.error
        throw new ErrorHandler(500, "Error while mail sender");
    }

}
export default sendMail;
