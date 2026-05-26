import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { sendVerificationEmail } from '../services/mailer.js';
import { sendVerificationSMS, checkVerificationSMS } from '../services/sms.js';

const googleClient = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID || 'mock-client-id');
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased limit to avoid blocking during development
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
  const profile = { id: user.id, email: user.email, name: user.name, phone: user.phone, phoneVerified: !!user.phone_verified, role: user.role, avatar: user.avatar || null };
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

  // Generate secure verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

  db.prepare(
    'INSERT INTO verification_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)'
  ).run(uuid(), id, verificationToken, expiresAt);

  // Send verification email asynchronously
  sendVerificationEmail(email, name, verificationToken).catch(err => console.error('Failed to send verification email', err));

  res.status(201).json({ 
    success: true, 
    message: 'Account created. Please check your email to verify your account.' 
  });
});

// GET /api/auth/verify-email
router.get('/verify-email', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  const record = db.prepare('SELECT * FROM verification_tokens WHERE token = ?').get(token);
  if (!record) return res.status(400).json({ error: 'Invalid or expired verification token' });

  if (new Date(record.expires_at) < new Date()) {
    db.prepare('DELETE FROM verification_tokens WHERE id = ?').run(record.id);
    return res.status(400).json({ error: 'Verification token has expired' });
  }

  // Update user and delete token
  db.prepare('UPDATE users SET email_verified = 1 WHERE id = ?').run(record.user_id);
  db.prepare('DELETE FROM verification_tokens WHERE id = ?').run(record.id);

  res.json({ success: true, message: 'Email verified successfully. You can now log in.' });
});

// POST /api/auth/google
router.post('/google', authLimiter, async (req, res) => {
  const { credential, role } = req.body;
  
  if (!credential) {
    return res.status(400).json({ error: 'Missing Google credential' });
  }

  try {
    let payload;
    
    // MOCK LOGIN SUPPORT FOR LOCAL DEV
    if (credential === 'mock-credential') {
      payload = {
        sub: 'mock-google-id-123',
        email: 'mockuser@example.com',
        name: 'Mock Google User',
        email_verified: true
      };
    } else {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.VITE_GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    }

    const { sub: googleId, email, name, email_verified } = payload;

    // Look for existing user by Google ID or Email
    let user = db.prepare('SELECT * FROM users WHERE google_id = ? OR email = ?').get(googleId, email);

    if (!user) {
      // Create new user
      const id = uuid();
      const userRole = role || 'client';
      
      db.prepare(
        'INSERT INTO users (id, email, name, google_id, role, email_verified) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(id, email, name, googleId, userRole, email_verified ? 1 : 0);

      if (userRole === 'driver') {
        db.prepare(
          'INSERT INTO driver_profiles (user_id, vehicle) VALUES (?, ?)'
        ).run(id, 'Not specified');
      }
      
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    } else if (!user.google_id) {
      // Link Google ID to existing email account
      db.prepare('UPDATE users SET google_id = ? WHERE id = ?').run(googleId, user.id);
      user.google_id = googleId;
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Account suspended' });
    }

    const token = generateToken(user);
    const profile = { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      phone: user.phone, 
      role: user.role, 
      phoneVerified: !!user.phone_verified 
    };

    res.json({ token, user: profile });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// POST /api/auth/send-sms
router.post('/send-sms', authenticate, authLimiter, async (req, res) => {
  let { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  // Format to E.164 for Twilio if missing country code
  phone = phone.replace(/\D/g, '');
  if (phone.length === 10) {
    phone = '+1' + phone;
  } else if (!phone.startsWith('+')) {
    phone = '+' + phone;
  }

  // Update user phone number
  db.prepare('UPDATE users SET phone = ? WHERE id = ?').run(phone, req.user.id);

  const sent = await sendVerificationSMS(phone);
  
  if (sent) {
    res.json({ success: true, message: 'Verification SMS sent' });
  } else {
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// POST /api/auth/verify-sms
router.post('/verify-sms', authenticate, authLimiter, async (req, res) => {
  const user = req.user;
  const { code } = req.body;
  
  if (!code) return res.status(400).json({ error: 'Verification code is required' });

  const isValid = await checkVerificationSMS(user.phone, code);

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  // Mark phone as verified
  db.prepare("UPDATE users SET phone_verified = 1 WHERE id = ?").run(user.id);

  // Also update user status to pending kyc if they are a driver
  const driverProfile = db.prepare("SELECT kyc_status FROM driver_profiles WHERE user_id = ?").get(user.id);
  if (user.role === 'driver' && driverProfile?.kyc_status === 'none') {
    db.prepare("UPDATE driver_profiles SET kyc_status = 'pending' WHERE user_id = ?").run(user.id);
  }

  res.json({ success: true, message: 'Phone verified successfully' });
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
  const profile = { ...req.user, phoneVerified: !!req.user.phone_verified };
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

  let updateQuery = 'UPDATE users SET name = ?, phone = ?';
  let params = [name, phone || null];
  
  let requireReverification = false;
  const currentUser = db.prepare('SELECT email FROM users WHERE id = ?').get(req.user.id);
  
  if (email !== currentUser.email) {
    updateQuery += ', email = ?, email_verified = 0';
    params.push(email);
    requireReverification = true;
  } else {
    updateQuery += ', email = ?';
    params.push(email);
  }

  if (password) {
    const hashed = bcrypt.hashSync(password, 10);
    updateQuery += ', password = ?';
    params.push(hashed);
  }

  updateQuery += ' WHERE id = ?';
  params.push(req.user.id);

  db.prepare(updateQuery).run(...params);
  
  if (req.user.role === 'driver') {
    const { vehicle, licensePlate } = req.body;
    if (vehicle || licensePlate) {
      db.prepare('UPDATE driver_profiles SET vehicle = COALESCE(?, vehicle), license_plate = COALESCE(?, license_plate) WHERE user_id = ?')
        .run(vehicle || null, licensePlate || null, req.user.id);
    }
  }
  
  if (requireReverification) {
    // Delete any existing tokens
    db.prepare('DELETE FROM verification_tokens WHERE user_id = ?').run(req.user.id);
    
    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    db.prepare(
      'INSERT INTO verification_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)'
    ).run(uuid(), req.user.id, verificationToken, expiresAt);
    
    sendVerificationEmail(email, name, verificationToken).catch(console.error);
    
    return res.json({ 
      success: true, 
      message: 'Profile updated. Since you changed your email, you have been logged out and need to verify the new email address.',
      reverifyRequired: true
    });
  }

  res.json({ success: true, message: 'Profile updated successfully' });
});

// ── DEV MODE BYPASS ROUTES ─────────────────────────────────────
router.post('/bypass-kyc', authenticate, (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Only drivers' });
  db.prepare(`UPDATE driver_profiles SET kyc_status = 'approved', stripe_account_id = 'acct_bypass_123' WHERE user_id = ?`).run(req.user.id);
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

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = db.prepare('SELECT id, phone FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email address' });
  }

  if (!user.phone) {
    return res.status(400).json({ error: 'No phone number associated with this account. Please contact support.' });
  }

  // Format phone to E.164 for Twilio
  let formattedPhone = user.phone.replace(/\D/g, '');
  if (formattedPhone.length === 10) {
    formattedPhone = '+1' + formattedPhone;
  } else if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+' + formattedPhone;
  }

  // Delete any old codes for this user
  db.prepare('DELETE FROM sms_codes WHERE user_id = ?').run(user.id);

  const sent = await sendVerificationSMS(formattedPhone);
  
  if (sent) {
    const maskedPhone = formattedPhone.length > 7 
      ? formattedPhone.slice(0, 3) + '****' + formattedPhone.slice(-4) 
      : '***-****';
    res.json({ success: true, maskedPhone });
  } else {
    res.status(500).json({ error: 'Failed to send recovery SMS. Try again later.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Email, verification code, and new password are required' });
  }

  const user = db.prepare('SELECT id, phone FROM users WHERE email = ?').get(email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!user.phone) return res.status(400).json({ error: 'No phone associated with this user' });

  const isValid = await checkVerificationSMS(user.phone, code);
  
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid or expired verification code' });
  }

  const hashed = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, user.id);
  db.prepare('DELETE FROM sms_codes WHERE user_id = ?').run(user.id);

  res.json({ success: true, message: 'Password has been reset successfully' });
});

export default router;
