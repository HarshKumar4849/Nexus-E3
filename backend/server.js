const express = require('express');
const http = require('http');
const app = express();

const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// Route handlers have been moved
const { initSocket } = require('./config/socket');
const connectDB = require('./config/connectDB');

// ====== CONFIG ======
const port = process.env.BACKEND_PORT || 8000;

// ====== CREATE HTTP SERVER ======
const server = http.createServer(app);

// ====== MIDDLEWARE ======
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ====== DATABASE ======
connectDB()
  .then(() => console.log('DB connected'))
  .catch(err => {
    console.error('DB connection failed:', err.message);
  });

// ====== ROUTES ======
app.get('/', (req, res) => {
  res.send('Server is running...');
});

const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRoutes');
app.use('/user', userRouter);
app.use('/api/admin', adminRouter);

const routeRouter = require('./routes/routeRoutes');
app.use('/api/routes', routeRouter);
app.use('/routes', routeRouter); // Keep legacy /routes for backward compatibility with frontend if needed

// ====== SOCKET.IO INIT ======
initSocket(server);

// ====== START SERVER ======
server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
