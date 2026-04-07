const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL || "missing_email",
        pass: process.env.EMAIL_PASS || "missing_pass"
    }
});

const sendEmail = async(to, otp) => {
    if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
        throw new Error("Missing EMAIL or EMAIL_PASS environment variables");
    }

    try {
        await transporter.sendMail({
            from: `"Campus Commute" <${process.env.EMAIL}>`,
            to,
            subject: "Your OTP Verification Code",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                <h2 style="color: #0d9488; text-align: center;">Welcome to Campus Commute</h2>
                <p style="font-size: 16px; color: #333;">Hello,</p>
                <p style="font-size: 16px; color: #333;">Please use the verification code below to complete your authentication. This code is valid for exactly <strong>5 minutes</strong>.</p>
                
                <div style="background-color: #f3f4f6; padding: 15px; margin: 20px 0; text-align: center; border-radius: 5px;">
                    <h1 style="font-size: 32px; letter-spacing: 5px; color: #111; margin: 0;">${otp}</h1>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-top: 20px;">If you did not make this request, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                <p style="font-size: 12px; color: #999; text-align: center;">© 2026 Campus Commute. All rights reserved.</p>
            </div>
            `
        });
    } catch(err) {
        console.error("Nodemailer failed:", err);
    }
};

module.exports = sendEmail;