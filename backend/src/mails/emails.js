import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";
import { PASSWORD_RESET_REQUEST, PASSWORD_RESET_SUCCESS, VERIFICATION_EMAIL, WELCOME_EMAIL } from "./emailTemplate.js";

// Lazy transporter - dotenv.config() poora load hone ke baad hi banega
let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    return transporter;
};

const sendVerificationMail = async (recipient, username, verificationToken) => {
    try {
        await getTransporter().sendMail({
            from: process.env.SENDER_NAME,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL.replace("{username}", username)
                .replace("{Verification code}", verificationToken)
        });
    } catch (err) {
        console.log(err);
        throw new ApiError(500, "Error while sending verification email");
    }
}

const sendWelcomeMail = async (recipient, username) => {
    try {
        await getTransporter().sendMail({
            from: process.env.SENDER_NAME,
            to: recipient,
            subject: "Welcome to SmartServe",
            html: WELCOME_EMAIL.replace("{username}", username)
        });
    } catch (err) {
        console.log(err);
        throw new ApiError(500, "Error while sending welcome email");
    }
}

const sendPasswordResetEmail = async (email, name, resetURL) => {
    try {
        await getTransporter().sendMail({
            from: process.env.SENDER_NAME,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST.replace("{reset_link}", resetURL).replace("{userName}", name)
        });
    } catch (err) {
        console.log(err);
        throw new ApiError(500, `Error while sending mail: ${err}`);
    }
}

const sendResetSuccessMail = async (email, name) => {
    try {
        await getTransporter().sendMail({
            from: process.env.SENDER_NAME,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS.replace("{userName}", name),
        });
    } catch (err) {
        console.log(err);
        throw new ApiError(500, `Error while sending reset success mail: ${err}`);
    }
}

export { sendPasswordResetEmail, sendResetSuccessMail, sendVerificationMail, sendWelcomeMail }