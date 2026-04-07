const generateOTP = require("../utils/otp");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");

// Pure In-Memory Map tailored for OTP
// Structure: Map<email, { hashedOtp: string, expiresAt: number, attempts: number, cooldownUntil: number }>
const otpMap = new Map();

module.exports.sendOTP = async(req,res) => {
    const { email } = req.body;
    const now = Date.now();

    const existingRecord = otpMap.get(email);

    // Enforce 1-minute cooldown between send requests
    if (existingRecord && existingRecord.cooldownUntil > now) {
      return res.status(429).json({ 
        error: "Please wait before requesting another OTP" 
      });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp,10);

    // Store with 5 min expiration and 1 minute cooldown
    otpMap.set(email, {
        hashedOtp,
        expiresAt: now + 5 * 60 * 1000, 
        cooldownUntil: now + 60 * 1000,
        attempts: 0,
        verified: false
    });

    try {
        await sendEmail(email, otp);
        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to send email" });
    }
}

module.exports.verifyOTP = async(req,res) => {
    const { email, enteredOTP } = req.body; // Match the frontend payload
    const otpToVerify = enteredOTP || req.body.otp;
    const now = Date.now();

    const record = otpMap.get(email);

    if (!record) {
        return res.status(400).json({ error: "No OTP requested" });
    }

    if (now > record.expiresAt) {
        otpMap.delete(email);
        return res.status(400).json({ error: "OTP expired" });
    }

    record.attempts += 1;
    if (record.attempts > 5) {
        otpMap.delete(email); // strict purge after max attempts
        return res.status(429).json({ error: "Too many attempts, please request a new OTP" });
    }

    const isMatch = await bcrypt.compare(otpToVerify, record.hashedOtp);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid OTP" });
    }

    // Mark as verified and bridge to authControllers via redis fallback
    record.verified = true;
    const redisClient = require("../config/redisClient");
    await redisClient.set(`verified:${email}`, "true", { EX: 600 });

    res.json({ message: "OTP verified successfully" });
}