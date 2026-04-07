# Campus Commute OTP Authentication System

This is a production-ready Email Verification System powered by a completely decoupled In-Memory mapping service natively integrated tightly with Nodemailer, avoiding any dependency bloat or system overhead.

## Architecture Map

1. **Frontend Request**: When the user enters their email and password (or hits forgot password), a `POST /api/auth/send-otp` is sent.
2. **Backend Engine**: The backend verifies rate-limits (1-minute cooldown), generates a secure 6-digit pin, Hashes it using Bcrypt, and stores the hash into an ephemeral JS `Map()` memory structure that clears precisely after 5 minutes.
3. **Nodemailer Transport**: A gorgeously styled responsive HTML email flies securely via Google's trusted SMTP servers directly to the applicant's inbox.
4. **Verification Call**: An auto-advancing 6-character UI collects the PIN and hits `POST /api/auth/verify-otp`.
5. **Database Entry**: Upon match, the AuthContext passes the token, registers the user in MongoDB, and redirects them to the authenticated Dashboard!

---

## 🛠 Usage & Setup Guide

### 1. The .env configuration
For this engine to fire, you require a specialized App Password (NOT your real Gmail account password) to bypass Google's 2FA safely.

1. Navigate to: `myaccount.google.com/security`
2. Turn on **2-Step Verification**.
3. Under 2-Step Verification, scroll to the bottom and click on **App Passwords**.
4. Name the App "Node Backend". Google will generate a **16-character string**.
5. Copy format this exactly into your `backend/.env` file:
```env
BACKEND_PORT=8000
MONGODB_URI="mongodb+srv://casper_db_user:my_busapp123@project.rwqoigv.mongodb.net/"
JWT_SECRET="topsecret"
EMAIL="your.email@gmail.com"
EMAIL_PASS="your-16-character-app-password"
```

### 2. Booting the Application
Execute the following to boot your API:
```bash
cd backend
npm install
node server.js
```

Execute the following to run the UI Interface:
```bash
cd Campus-commute
npm install
npm run dev
```

*Your backend sits elegantly at `localhost:8000` while your frontend sits natively at `localhost:5173`. CORS guarantees secure bidirectional tunneling strictly for this context.*
