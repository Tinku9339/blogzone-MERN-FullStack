import express from 'express'
import mongoose from 'mongoose'
import dns from 'dns'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load .env relative to this file for cross-directory startup safety
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

import authRoutes from './routes/authRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

// Only override DNS servers in local dev if explicitly requested.
// DO NOT override on cloud hosting (Render, AWS, GCP) where host DNS resolver is required.
if (process.env.FORCE_GOOGLE_DNS === 'true') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4'])
  } catch (err) {
    console.warn('Custom DNS set failed:', err.message)
  }
}

const app = express()

// CORS — allow local development, configured FRONTEND_URL, and any Vercel deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/+$/, '')] : []),
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile apps, server-to-server)
      if (!origin) return callback(null, true)

      const cleanOrigin = origin.replace(/\/+$/, '')

      // Check configured origins
      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true)
      }

      // Automatically allow any Vercel deployment (*.vercel.app)
      if (/^https:\/\/.*\.vercel\.app$/.test(cleanOrigin)) {
        return callback(null, true)
      }

      // Gracefully decline unlisted origins without throwing an unhandled server error
      return callback(null, false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Public root status endpoint for quick verification
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'BlogZone API',
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting_or_disconnected',
    healthCheck: '/api/dashboard/health',
    timestamp: new Date().toISOString(),
  })
})

// Register all API routes
app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack || err.message)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

// Bind HTTP server immediately to 0.0.0.0 so Render detects open port without waiting on DB
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on PORT: ${PORT} 🚀`)
  console.log(`Health check: http://localhost:${PORT}/api/dashboard/health`)
})

// Resilient MongoDB Connection (does not block port binding or crash container on temporary DB downtime)
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('⚠️ CRITICAL: MONGO_URI is missing in environment variables!')
    return
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Fail fast (10s) instead of hanging indefinitely
    })
    console.log('MONGODB CONNECTED ✅')
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message)
    console.error('👉 TIP: Ensure 0.0.0.0/0 (all IPs) is whitelisted in MongoDB Atlas Network Access.')
  }
}

connectDB()

export default app