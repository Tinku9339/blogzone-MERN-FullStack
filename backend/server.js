import express from 'express'
import mongoose from 'mongoose'
import dns from 'dns';
import cors from 'cors'
import 'dotenv/config'

import authRoutes from './routes/authRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// CORS — allow Vite dev server and production frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Register ALL routes BEFORE the async DB connection ──────────────────────
// This is critical in Express 5 with top-level await — routes registered after
// await are subject to timing issues in certain Node.js versions.
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global error handler (Express 5 requires all 4 params)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});
// ─────────────────────────────────────────────────────────────────────────────

// DB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MONGODB CONNECTED ✅');
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
  }
};

await connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT} 🚀`);
  console.log(`Health check: http://localhost:${PORT}/api/dashboard/health`);
});

export default app;