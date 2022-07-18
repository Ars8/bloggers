import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.NODEMAILER_USER,
              pass: process.env.NODEMAILER_PASS,
            },
          });
        
          let info = await transporter.sendMail({
            from: '"Fransua bloggers" <fransuazakubov@gmail.com>',
            to: email,
            subject: subject,
            html: message,
          });
    
          return info
    }
}