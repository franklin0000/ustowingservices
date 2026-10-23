import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupWebSocket } from './websocket.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import xss from 'xss-clean';

// Route imports
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import driverRoutes from './routes/drivers.js';
import paymentRoutes from './routes/payments.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import stripeRoutes from './routes/stripe.js';
import pricingRoutes from './routes/pricing.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security Middleware ────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for local dev compatibility
  crossOriginOpenerPolicy: false, // Disabled entirely for mobile Safari compatibility with Google OAuth
  crossOriginResourcePolicy: false, // Fixes Google iframe blocking
  crossOriginEmbedderPolicy: false, // Fixes Google iframe blocking
  referrerPolicy: { policy: "strict-origin-when-cross-origin" } // Required for Google OAuth to verify origin
}));

// Global API rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', globalLimiter);

// Strict rate limiting for sensitive authentication endpoints (anti-brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 attempts per IP per window
  message: { error: 'Too many authentication attempts. Please try again in 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Sanitize user data to prevent XSS
app.use(xss());

// ── General Middleware ─────────────────────────────────────────
const allowedOrigins = [
  'https://ustowingservices.com',
  'https://www.ustowingservices.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || process.env.NODE_ENV !== 'production') return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const color = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    console.log(`  ${color}${req.method}\x1b[0m ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// ── API Routes ──────────────────────────────────────────────
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
  }
}));
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/pricing', pricingRoutes);

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Production Frontend Serving ───────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ── Error handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.name === 'MulterError' || (err.message && (err.message.includes('permitted') || err.message.includes('Invalid file type')))) {
    return res.status(400).json({ error: err.message });
  }
  console.error('  Server error:', err.message);
  res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message });
});

// ── Start ───────────────────────────────────────────────────
const server = createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║     GRUAS API SERVER                 ║');
  console.log(`  ║     http://localhost:${PORT}             ║`);
  console.log('  ║     WebSocket on /ws                 ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});
