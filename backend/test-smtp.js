require('dotenv').config({path: './.env'});
const nodemailer = require('nodemailer');

const rawPass = (process.env.EMAIL_PASS || "").replace(/\s/g, "");
const email = process.env.EMAIL;

async function testMail() {
    console.log("Email:", email, "Pass length:", rawPass.length);
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: { user: email, pass: rawPass },
        });
        
        await transporter.verify();
        console.log("SMTP verified successfully");
    } catch(err) {
        console.error("SMTP error:", err.message);
    }
}
testMail();
