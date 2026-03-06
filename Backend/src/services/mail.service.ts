import { transporter } from "../config/transporter.config";
import { SentMessageInfo } from "nodemailer";

import { MailOptions } from "../types/mail.type";

export const sendMail = async ({ to, subject, text, html }: MailOptions): Promise<{ message: string; info?: SentMessageInfo }> => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: `"No Reply SITCertificate" <${Bun.env.EMAIL_USER}>`,
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