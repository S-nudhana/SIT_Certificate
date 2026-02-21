import { transporter } from "../config/transporter.config";
import { SentMessageInfo } from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendMail = async ({ to, subject, text, html }: MailOptions): Promise<{ message: string; info?: SentMessageInfo }> => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: `"No Reply SITCertificate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject({ message: "Failed to send email", error });
      } else {
        resolve({ message: "Email sent", info });
      }
    });
  });
};