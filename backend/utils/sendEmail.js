const nodeMailer = require("nodemailer");

// We would not be using email testing servie such as MailTrap as email nhi jati actual me
// usse (bs show hota h ki chli gyi), we would be directly using gmail and mail would be sent
const sendEmail = async (options) => {
    // const transporter = nodeMailer.createTransport({
    //     host: process.env.SMTP_HOST,
    //     port: process.env.SMTP_PORT,
    //     service: process.env.SMTP_SERVICE,
    //     auth: {
    //         user: process.env.SMTP_MAIL,
    //         pass: process.env.SMTP_PASSWORD,
    //     }
    // })

    // const mailOptions = {
    //     from: process.env.SMTP_MAIL,
    //     to: options.email,
    //     subject: options.subject,
    //     message: options.message,
    // }

    // const info = await transporter.sendMail(mailOptions);
    try {
        const transporter = nodeMailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          service: process.env.SMTP_SERVICE,
          auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        });
    
        const mailOptions = {
          from: process.env.SMTP_MAIL,
          to: options.email,
          subject: options.subject,
          text: options.message, // Use 'text' instead of 'message' for the email content
        };
    
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
      } catch (error) {
        console.error("Error sending email:", error);
      }
};

module.exports = sendEmail;
