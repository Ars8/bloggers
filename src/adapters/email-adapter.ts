import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: testAccount.user, // generated ethereal user
              pass: testAccount.pass, // generated ethereal password
            },
          });
        
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: 'Fransua', // sender address
            to: email, // sender addresslist of receivers
            subject: subject, // Subject line
            html: message, // html body
          });
    
          return info
    }
}