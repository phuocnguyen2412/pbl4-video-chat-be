import nodemailer from "nodemailer";
import envServer from "../env";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: envServer.EMAIL_USER,
        pass: envServer.EMAIL_PASS,
    },
});

export default async function sendMail(
    to: string[],
    subject: string,
    text: string
) {
    await transporter.sendMail({
        from: "Hệ thống chat video",
        to: to.join(", "),
        subject: subject,
        text: text,
    });
}