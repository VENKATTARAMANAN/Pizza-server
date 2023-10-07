import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer"

export const sendMail = async (sendTo, subject, text) => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `${process.env.MAIL_ID}`,
          pass: `${process.env.PASSWORD}`,
        },
      });
  
      var mailOptions = {
        from: `${process.env.MAIL_ID}`,
        to: sendTo,
        subject,
        text,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
         return res.status(200).json({
            data: {
              message: "Mail send successfully",
            },
          });
        }
      });
}