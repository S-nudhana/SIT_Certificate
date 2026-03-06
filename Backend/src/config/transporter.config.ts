import nodemailer from 'nodemailer';

const EMAIL_HOST = Bun.env.EMAIL_HOST
const EMAIL_PORT: number = Number(Bun.env.EMAIL_PORT)
const EMAIL_USER = Bun.env.EMAIL_USER
const EMAIL_PASS = Bun.env.EMAIL_PASS

export const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
});