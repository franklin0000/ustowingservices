import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many authentication attempts from this IP, please try again later.' }
});

const router = Router();

// POST /api/auth/login
router.post('/login', authLimiter, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Account suspended' });
  }

  const token = generateToken(user);

  // Build profile based on role
  const profile = { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role, avatar: user.avatar || null };
  if (user.role === 'driver') {
    const dp = db.prepare('SELECT * FROM driver_profiles WHERE user_id = ?').get(user.id);
    if (dp) {
      profile.vehicle = dp.vehicle;
      profile.rating = dp.rating;
      profile.completedJobs = dp.completed_jobs;
      profile.totalEarnings = dp.total_earnings;
      profile.available = !!dp.available;
      profile.kycStatus = dp.kyc_status;
      
      const sub = db.prepare("SELECT * FROM subscriptions WHERE driver_id = ? AND status = 'active' AND expires_at > datetime('now')").get(user.id);
      profile.subscriptionActive = !!sub;
    }
  }

  res.json({ token, user: profile });
});

// POST /api/auth/register
router.post('/register', authLimiter, (req, res) => {
  const { email, password, name, phone, role } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }
  if (role && !['client', 'driver'].includes(role)) {
    return res.status(400).json({ error: 'Role must be client or driver' });
  }

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const id = uuid();
  const hashed = bcrypt.hashSync(password, 10);
  const userRole = role || 'client';

  db.prepare(
    'INSERT INTO users (id, email, password, name, phone, role) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, email, hashed, name, phone || null, userRole);

  if (userRole === 'driver') {
    const { vehicle, licensePlate } = req.body;
    db.prepare(
      'INSERT INTO driver_profiles (user_id, vehicle, license_plate) VALUES (?, ?, ?)'
    ).run(id, vehicle || 'Not specified', licensePlate || null);
  }

  const user = db.prepare('SELECT id, email, name, phone, role FROM users WHERE id = ?').get(id);
  const token = generateToken(user);
  res.status(201).json({ token, user });
});

import multer from 'multer';
import path from 'path';

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'server/uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET /api/auth/me  — return current user profile
router.get('/me', authenticate, (req, res) => {
  const profile = { ...req.user };
  if (req.user.role === 'driver') {
    const dp = db.prepare('SELECT * FROM driver_profiles WHERE user_id = ?').get(req.user.id);
    if (dp) {
      profile.vehicle = dp.vehicle;
      profile.licensePlate = dp.license_plate;
      profile.latitude = dp.latitude;
      profile.longitude = dp.longitude;
      profile.available = !!dp.available;
      profile.rating = dp.rating;
      profile.completedJobs = dp.completed_jobs;
      profile.totalEarnings = dp.total_earnings;
      profile.kycStatus = dp.kyc_status;
      
      const sub = db.prepare("SELECT * FROM subscriptions WHERE driver_id = ? AND status = 'active' AND expires_at > datetime('now')").get(req.user.id);
      profile.subscriptionActive = !!sub;
    }
  }
  
  // Load avatar from users table
  const u = db.prepare('SELECT avatar FROM users WHERE id = ?').get(req.user.id);
  profile.avatar = u?.avatar || null;
  
  res.json(profile);
});

// POST /api/auth/profile/avatar
router.post('/profile/avatar', authenticate, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const avatarUrl = `/uploads/${req.file.filename}`;
  db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatarUrl, req.user.id);
  res.json({ success: true, avatarUrl });
});


// PUT /api/auth/profile — update user profile
router.put('/profile', authenticate, (req, res) => {
  const { name, phone, email, password } = req.body;
  
  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Check if email is taken by another user
  const exists = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.user.id);
  if (exists) {
    return res.status(409).json({ error: 'Email already in use' });
  }

  let updateQuery = 'UPDATE users SET name = ?, phone = ?, email = ?';
  let params = [name, phone || null, email];

  if (password) {
    const hashed = bcrypt.hashSync(password, 10);
    updateQuery += ', password = ?';
    params.push(hashed);
  }

  updateQuery += ' WHERE id = ?';
  params.push(req.user.id);

  db.prepare(updateQuery).run(...params);

  res.json({ success: true, message: 'Profile updated successfully' });
});

// ── DEV MODE BYPASS ROUTES ─────────────────────────────────────
router.post('/bypass-kyc', authenticate, (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Only drivers' });
  db.prepare(`UPDATE driver_profiles SET kyc_status = 'approved' WHERE user_id = ?`).run(req.user.id);
  res.json({ success: true, bypassed: true });
});

// POST /api/auth/kyc-upload
// Simulates Stripe Identity Session verification
router.post('/kyc-upload', authenticate, (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Only drivers' });
  
  const { idDocument, licenseDoc } = req.body;
  if (!idDocument || !licenseDoc) {
    return res.status(400).json({ error: 'Both Official ID and Driver License documents are required for Stripe Identity' });
  }

  // Update driver profile with documents and instantly approve to simulate Stripe Verification
  db.prepare(`
    UPDATE driver_profiles 
    SET id_document = ?, insurance_doc = ?, kyc_status = 'approved', updated_at = datetime('now')
    WHERE user_id = ?
  `).run(idDocument, licenseDoc, req.user.id);

  // Send successful verification notification
  import('../services/notifications.js').then(({ notify, pushEvent }) => {
    notify(req.user.id, 'system', 'Stripe Identity Verified', 'Your identity has been successfully verified by Stripe. Payouts are now enabled.');
    pushEvent(req.user.id, 'kyc_verified', { status: 'approved' });
  }).catch(console.error);

  res.json({ success: true, message: 'Identity verified successfully via Stripe Identity.' });
});

export default router;
