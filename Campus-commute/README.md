# 🚌 Campus Commute

A full-stack, production-grade college bus tracking and management platform — built with **React + TypeScript (Vite)** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## 🌟 Features

- **Live Bus Tracking** — Real-time GPS broadcast from driver to student map via Socket.IO
- **Road-Following Simulation** — Bus icon moves along actual road geometry (OSRM), not straight lines
- **Role-Based Auth** — Admin, Driver, Student with secure JWT sessions
- **OTP Email Verification** — Email-based OTP on signup (Gmail SMTP, tries ports 587 & 465)
- **Admin Control Panel** — Manage global settings, driver assignments, bus routes, and all users
- **Driver Secret Key** — Prevents students from signing up on the Driver portal
- **Registration No. Uniqueness** — One student per registration number enforced in DB
- **Block / Delete Users** — Admins can ban fake or spam accounts instantly
- **Google OAuth Login** — One-tap sign-in for students

---

## 🔑 Test Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@test.edu` | `Admin@1234` |
| **Driver** | `driver@test.edu` | `Driver@1234` |
| **Student** | `student@test.edu` | `Student@1234` |

> Run `node seedAdmin.js` in the `/backend` directory to create / reset these accounts.

---

## 🔐 Default Driver Secret Key

When a driver signs up, they must enter the **Driver Secret Key** to prove they are an authorized driver (not a student bypassing the role selection).

**Default key:** `DRIVER2024`

> The admin can change this anytime from **Admin Panel → Global Settings → Driver Secret Key**.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Maps** | Leaflet (`react-leaflet`) + OSRM for road routing |
| **Real-time** | Socket.IO (driver → student location) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT (cookies) + Google OAuth 2.0 |
| **Email** | Nodemailer + Gmail SMTP (App Password) |

---

## 🏗️ Folder Structure

```
Nexus-E3/
├── Campus-commute/          # React frontend (Vite)
│   └── src/
│       ├── components/      # Reusable UI (AuthCard, GradientButton, etc.)
│       ├── contexts/        # AuthContext, RouteContext
│       └── pages/           # Student, Driver, Admin pages
│
└── backend/                 # Node.js + Express API
    ├── controllers/         # authControllers, adminControllers
    ├── models/              # UserModel, AdminSettings, OTP
    ├── routes/              # userRouter, adminRoutes
    ├── data/                # routes.json (28 bus routes)
    └── seedAdmin.js         # Creates all 3 test users
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:8080
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
EMAIL=your_gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx   # Gmail App Password (with or without spaces)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend (`Campus-commute/.env`)
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🚀 Running Locally

### 1. Backend
```bash
cd backend
npm install
node seedAdmin.js   # Create test users
npm run dev         # Starts on port 8000
```

### 2. Frontend
```bash
cd Campus-commute
npm install
npm run dev         # Starts on port 8080
```

---

## 📬 Gmail OTP Setup

1. Enable **2-Factor Authentication** on your Gmail account
2. Go to **Google Account → Security → App Passwords**
3. Create an App Password for "Mail"
4. Paste it as `EMAIL_PASS` in `backend/.env` (spaces are auto-stripped)

> **Note:** On networks that block SMTP (college WiFi, etc.), the backend tries both port 587 and 465 automatically. If both fail, the OTP system returns an error — ensure you use a network that allows outbound SMTP for signup to work.

---

## 👤 User Roles

| Role | Access |
|------|--------|
| **Student** | Live map, bus tracking, stop timings, driver info |
| **Driver** | GPS broadcast, route map, bus management info |
| **Admin** | Full control: settings, routes, drivers, user management |

---

## 🛡️ Security

- OTP codes are **never exposed in the UI**
- JWT tokens stored in **HTTP-only cookies**
- Driver signup gated by **admin-controlled secret key**
- Blocked users **cannot log in**
- Registration numbers are **unique per student**
