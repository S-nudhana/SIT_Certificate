import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: 'smtp.sit.kmutt.ac.th',
    port: 465,
    secure: true,
    auth: {
        user: Bun.env.EMAIL_USER,
        pass: Bun.env.EMAIL_PASS
    },
});