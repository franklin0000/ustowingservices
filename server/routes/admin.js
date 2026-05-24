import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { adminOnly } from '../middleware/roles.js';
import { notify, pushEvent } from '../services/notifications.js';
import { estimateETA } from '../services/geo.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

const router = Router();
router.use(authenticate);
router.use(adminOnly);

// ── GET /api/admin/dashboard — aggregate metrics ────────────
router.get('/dashboard', (req, res) => {
  const totalRequests = db.prepare('SELECT COUNT(*) as c FROM jobs').get().c;
  const pendingRequests = db.prepare("SELECT COUNT(*) as c FROM jobs WHERE status = 'pending'").get().c;
  const completedRequests = db.prepare("SELECT COUNT(*) as c FROM jobs WHERE status = 'completed'").get().c;
  const activeJobs = db.prepare("SELECT COUNT(*) as c FROM jobs WHERE status IN ('accepted','en_route','arrived','in_service')").get().c;

  const totalDrivers = db.prepare('SELECT COUNT(*) as c FROM driver_profiles').get().c;
  const activeDrivers = db.prepare('SELECT COUNT(*) as c FROM driver_profiles WHERE available = 1').get().c;
  const totalUsers = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'client'").get().c;

  const revenueRow = db.prepare("SELECT COALESCE(SUM(platform_fee), 0) as total FROM payments WHERE status = 'completed'").get();
  const totalRevenue = revenueRow.total;

  const totalPayments = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'").get().total;
  const driverPayouts = db.prepare("SELECT COALESCE(SUM(driver_payout), 0) as total FROM payments WHERE status = 'completed'").get().total;

  // Recent 5 requests
  const recentRequests = db.prepare(`
    SELECT j.*, u.name as client_name FROM jobs j
    JOIN users u ON u.id = j.client_id
    ORDER BY j.created_at DESC LIMIT 5
  `).all();

  // Monthly stats (last 5 months)
  const monthlyStats = db.prepare(`
    SELECT strftime('%Y-%m', created_at) as month,
           COUNT(*) as jobs,
           COALESCE(SUM(amount), 0) as revenue
    FROM jobs WHERE status = 'completed'
    GROUP BY month ORDER BY month DESC LIMIT 5
  `).all().reverse();

  // Service distribution
  const serviceDistribution = db.prepare(`
    SELECT service_type, COUNT(*) as count FROM jobs GROUP BY service_type ORDER BY count DESC
  `).all();
  const serviceTotal = serviceDistribution.reduce((s, d) => s + d.count, 0);

  // Active Map Data (God mode)
  const activeDriversList = db.prepare(`
    SELECT u.id, u.name, dp.latitude, dp.longitude, dp.vehicle
    FROM driver_profiles dp JOIN users u ON u.id = dp.user_id
    WHERE dp.available = 1 OR dp.user_id IN (SELECT driver_id FROM jobs WHERE status IN ('accepted','en_route','arrived','in_service'))
  `).all();

  const activeJobsList = db.prepare(`
    SELECT id, client_id, driver_id, pickup_lat, pickup_lng, dest_lat, dest_lng, status, service_type
    FROM jobs WHERE status IN ('pending','matched','accepted','en_route','arrived','in_service')
  `).all();

  // Generate weekly revenue array for the last 7 days (Admin sees total platform revenue)
  const weeklyRevenue = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDate = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().split('T')[0];
    const dayName = days[d.getDay()];
    
    // Sum total amount from payments for this day
    const row = db.prepare("SELECT COALESCE(SUM(amount), 0) as rev, COUNT(*) as cnt FROM payments WHERE date(created_at) = ? AND status = 'completed'").get(dayStr);
    
    weeklyRevenue.push({
      day: dayName,
      revenue: row.rev,
      jobs: row.cnt
    });
  }

  res.json({
    totalRequests, pendingRequests, completedRequests, activeJobs,
    totalDrivers, activeDrivers, totalUsers,
    totalRevenue, totalPayments, driverPayouts,
    recentRequests: recentRequests.map(r => ({
      id: r.id, clientName: r.client_name, serviceType: r.service_type,
      pickupLocation: r.pickup_location, status: r.status, amount: r.amount,
      createdAt: r.created_at,
    })),
    monthlyStats,
    serviceDistribution: serviceDistribution.map(s => ({
      name: s.service_type,
      value: serviceTotal > 0 ? Math.round((s.count / serviceTotal) * 100) : 0,
      count: s.count,
    })),
    activeDriversList,
    activeJobsList,
    weeklyRevenue,
  });
});

// ── GET /api/admin/jobs — all jobs with filters ─────────────
router.get('/jobs', (req, res) => {
  const { status, search, limit = 50, offset = 0 } = req.query;
  let sql = `
    SELECT j.*, uc.name as client_name, uc.phone as client_phone,
           ud.name as driver_name
    FROM jobs j
    JOIN users uc ON uc.id = j.client_id
    LEFT JOIN users ud ON ud.id = j.driver_id
    WHERE 1=1
  `;
  const params = [];
  if (status) { sql += ' AND j.status = ?'; params.push(status); }
  if (search) {
    sql += ' AND (uc.name LIKE ? OR j.pickup_location LIKE ? OR j.id LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  sql += ' ORDER BY j.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  const jobs = db.prepare(sql).all(...params);
  const total = db.prepare('SELECT COUNT(*) as c FROM jobs').get().c;

  res.json({
    total,
    jobs: jobs.map(j => ({
      id: j.id, clientName: j.client_name, clientPhone: j.client_phone,
      driverName: j.driver_name, serviceType: j.service_type, vehicleType: j.vehicle_type,
      vehicleDetails: j.vehicle_details, pickupLocation: j.pickup_location,
      destination: j.destination, status: j.status, amount: j.amount,
      rating: j.rating, createdAt: j.created_at, completedAt: j.completed_at,
    })),
  });
});

// ── GET /api/admin/drivers — all drivers + profiles ─────────
router.get('/drivers', (req, res) => {
  const drivers = db.prepare(`
    SELECT u.id, u.name, u.email, u.phone, u.status,
           dp.vehicle, dp.license_plate, dp.latitude, dp.longitude,
           dp.available, dp.rating, dp.total_ratings, dp.completed_jobs, dp.total_earnings,
           dp.kyc_status, dp.id_document, dp.insurance_doc
    FROM users u JOIN driver_profiles dp ON dp.user_id = u.id
    WHERE u.role = 'driver'
    ORDER BY dp.completed_jobs DESC
  `).all();

  res.json(drivers.map(d => ({
    id: d.id, name: d.name, email: d.email, phone: d.phone,
    status: d.status, vehicle: d.vehicle, licensePlate: d.license_plate,
    latitude: d.latitude, longitude: d.longitude, available: !!d.available,
    rating: d.rating, totalRatings: d.total_ratings,
    completedJobs: d.completed_jobs, totalEarnings: d.total_earnings,
    kycStatus: d.kyc_status, idDocument: d.id_document, insuranceDoc: d.insurance_doc
  })));
});

// ── PUT /api/admin/drivers/:id/kyc — approve or reject ──────
router.put('/drivers/:id/kyc', (req, res) => {
  const { kycStatus } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(kycStatus)) {
    return res.status(400).json({ error: 'Invalid KYC status' });
  }
  db.prepare('UPDATE driver_profiles SET kyc_status = ? WHERE user_id = ?').run(kycStatus, req.params.id);
  res.json({ success: true, id: req.params.id, kycStatus });
});

// ── GET /api/admin/users — all client users ─────────────────
router.get('/users', (req, res) => {
  const { search } = req.query;
  let sql = "SELECT * FROM users WHERE role = 'client'";
  const params = [];
  if (search) {
    sql += ' AND (name LIKE ? OR email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  sql += ' ORDER BY created_at DESC';

  const users = db.prepare(sql).all(...params);
  res.json(users.map(u => {
    const jobCount = db.prepare('SELECT COUNT(*) as c FROM jobs WHERE client_id = ?').get(u.id).c;
    return {
      id: u.id, name: u.name, email: u.email, phone: u.phone,
      status: u.status, createdAt: u.created_at, requestCount: jobCount,
    };
  }));
});

// ── PUT /api/admin/users/:id/status — suspend / activate ────
router.put('/users/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Status must be active or suspended' });
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ error: 'Cannot modify admin status' });

  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true, id: req.params.id, status });
});

// ── PUT /api/admin/drivers/:id/availability — force toggle ──
router.put('/drivers/:id/availability', (req, res) => {
  const { available } = req.body;
  db.prepare('UPDATE driver_profiles SET available = ? WHERE user_id = ?')
    .run(available ? 1 : 0, req.params.id);
  res.json({ success: true });
});

// ── GET /api/admin/payments — all payments ──────────────────
router.get('/payments', (req, res) => {
  const payments = db.prepare(`
    SELECT p.*, uc.name as client_name, ud.name as driver_name, j.service_type
    FROM payments p
    JOIN users uc ON uc.id = p.client_id
    LEFT JOIN users ud ON ud.id = p.driver_id
    JOIN jobs j ON j.id = p.job_id
    ORDER BY p.created_at DESC
  `).all();

  const totals = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) as total_revenue,
           COALESCE(SUM(platform_fee), 0) as platform_fees,
           COALESCE(SUM(driver_payout), 0) as driver_payouts
    FROM payments WHERE status = 'completed'
  `).get();

  res.json({
    ...totals,
    payments: payments.map(p => ({
      id: p.id, jobId: p.job_id, clientName: p.client_name, driverName: p.driver_name,
      serviceType: p.service_type, amount: p.amount, platformFee: p.platform_fee,
      driverPayout: p.driver_payout, method: p.method, cardLast4: p.card_last4,
      status: p.status, date: p.created_at,
    })),
  });
});

// ── GET /api/admin/analytics — detailed analytics ───────────
router.get('/analytics', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as c FROM jobs').get().c;
  const completed = db.prepare("SELECT COUNT(*) as c FROM jobs WHERE status = 'completed'").get().c;
  const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

  const avgRating = db.prepare('SELECT AVG(rating) as avg FROM jobs WHERE rating IS NOT NULL').get().avg || 0;

  // Hourly distribution
  const hourly = db.prepare(`
    SELECT CAST(strftime('%H', created_at) AS INTEGER) as hour, COUNT(*) as requests
    FROM jobs GROUP BY hour ORDER BY hour
  `).all();

  // Response time data (simulated based on job durations)
  const monthly = db.prepare(`
    SELECT strftime('%Y-%m', created_at) as month,
           COUNT(*) as jobs, COALESCE(SUM(amount), 0) as revenue
    FROM jobs WHERE status = 'completed'
    GROUP BY month ORDER BY month DESC LIMIT 6
  `).all().reverse();

  // Top regions
  const regions = db.prepare(`
    SELECT pickup_location, COUNT(*) as count FROM jobs
    GROUP BY pickup_location ORDER BY count DESC LIMIT 5
  `).all();
  const regionTotal = regions.reduce((s, r) => s + r.count, 0);

  res.json({
    completionRate: parseFloat(completionRate),
    avgRating: Math.round(avgRating * 10) / 10,
    avgResponseTime: 7,
    activeCoverage: 92,
    hourlyDistribution: hourly,
    monthlyStats: monthly,
    topRegions: regions.map(r => ({
      name: r.pickup_location.split(',')[0],
      value: regionTotal > 0 ? Math.round((r.count / regionTotal) * 100) : 0,
    })),
  });
});

// ── GET/PUT /api/admin/settings ─────────────────────────────
router.get('/settings', (req, res) => {
  const rows = db.prepare('SELECT * FROM platform_settings').all();
  const settings = {};
  for (const row of rows) settings[row.key] = row.value;
  res.json(settings);
});

router.put('/settings', (req, res) => {
  const upsert = db.prepare(
    'INSERT INTO platform_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?'
  );
  const trx = db.transaction((entries) => {
    for (const [key, value] of entries) {
      upsert.run(key, String(value), String(value));
    }
  });
  trx(Object.entries(req.body));
  res.json({ success: true });
});

// ── PUT /api/admin/jobs/:id/cancel — admin cancel any job ───
router.put('/jobs/:id/cancel', (req, res) => {
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  db.prepare("UPDATE jobs SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?").run(job.id);
  if (job.driver_id) {
    db.prepare("UPDATE driver_profiles SET available = 1, updated_at = datetime('now') WHERE user_id = ?").run(job.driver_id);
  }
  res.json({ success: true });
});

// ── POST /api/admin/jobs — admin manual dispatch ────────────
router.post('/jobs', (req, res) => {
  const {
    clientPhone, clientName, serviceType, vehicleType, vehicleDetails,
    pickupLocation, pickupLat, pickupLng,
    destination, destLat, destLng, amount, notes, driverId
  } = req.body;

  if (!clientPhone || !serviceType || !pickupLocation || !pickupLat || !pickupLng) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Find or create client
  let client = db.prepare("SELECT id FROM users WHERE phone = ? AND role = 'client'").get(clientPhone);
  if (!client) {
    const clientId = uuid();
    // dummy email
    db.prepare("INSERT INTO users (id, email, password, name, phone, role) VALUES (?, ?, ?, ?, ?, 'client')")
      .run(clientId, `client_${clientPhone}@system.local`, 'nopass', clientName || 'Guest Client', clientPhone);
    client = { id: clientId };
  }

  const id = uuid();
  let initialStatus = 'pending';
  let assignedDriver = null;

  if (driverId) {
    assignedDriver = db.prepare("SELECT * FROM driver_profiles WHERE user_id = ?").get(driverId);
    if (assignedDriver) {
      initialStatus = 'accepted';
    }
  }

  db.prepare(`
    INSERT INTO jobs (id, client_id, driver_id, service_type, vehicle_type, vehicle_details,
      pickup_location, pickup_lat, pickup_lng, destination, dest_lat, dest_lng, amount, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, client.id, assignedDriver ? assignedDriver.user_id : null, serviceType, vehicleType, vehicleDetails || null,
    pickupLocation, pickupLat, pickupLng, destination || null, destLat || null, destLng || null,
    amount || 50, initialStatus, notes || null);

  if (assignedDriver) {
    db.prepare("UPDATE driver_profiles SET available = 0, updated_at = datetime('now') WHERE user_id = ?").run(assignedDriver.user_id);
    const eta = estimateETA(assignedDriver.latitude, assignedDriver.longitude, pickupLat, pickupLng);
    notify(assignedDriver.user_id, 'job', 'New Dispatched Job', 'An admin has assigned you a new job.', { jobId: id });
    pushEvent(assignedDriver.user_id, 'new_job', { jobId: id });
    pushEvent(client.id, 'job_accepted', {
      jobId: id,
      driver: { id: assignedDriver.user_id, vehicle: assignedDriver.vehicle, lat: assignedDriver.latitude, lng: assignedDriver.longitude },
      eta
    });
  } else {
    // Notify all active drivers
    const activeDrivers = db.prepare("SELECT user_id FROM driver_profiles WHERE available = 1").all();
    for (const d of activeDrivers) {
      pushEvent(d.user_id, 'new_job', { jobId: id });
    }
  }

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
  res.json({ success: true, job });
});

// ── PUT /api/admin/jobs/:id/assign — manual assign ──────────
router.put('/jobs/:id/assign', (req, res) => {
  const { driverId } = req.body;
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.status !== 'pending' && job.status !== 'matched') {
    return res.status(400).json({ error: 'Job is already assigned or completed' });
  }

  const driver = db.prepare("SELECT * FROM driver_profiles WHERE user_id = ?").get(driverId);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });

  db.prepare("UPDATE jobs SET driver_id = ?, status = 'accepted', updated_at = datetime('now') WHERE id = ?").run(driverId, job.id);
  db.prepare("UPDATE driver_profiles SET available = 0, updated_at = datetime('now') WHERE user_id = ?").run(driverId);

  const u = db.prepare("SELECT name, phone FROM users WHERE id = ?").get(driverId);
  const eta = estimateETA(driver.latitude, driver.longitude, job.pickup_lat, job.pickup_lng);

  notify(driverId, 'job', 'Manual Assignment', 'An admin assigned you a job.', { jobId: job.id });
  pushEvent(driverId, 'new_job', { jobId: job.id });
  pushEvent(job.client_id, 'job_accepted', {
    jobId: job.id,
    driver: { id: driverId, name: u.name, phone: u.phone, vehicle: driver.vehicle, rating: driver.rating, lat: driver.latitude, lng: driver.longitude },
    eta
  });

  res.json({ success: true });
});

// ── GET /api/admin/payouts ──────────────────────────────────
router.get('/payouts', (req, res) => {
  const payouts = db.prepare(`
    SELECT p.*, u.name as driver_name, u.email as driver_email, dp.stripe_account_id
    FROM payouts p
    JOIN users u ON u.id = p.driver_id
    JOIN driver_profiles dp ON dp.user_id = p.driver_id
    ORDER BY p.created_at DESC
  `).all();
  res.json(payouts);
});

// ── PUT /api/admin/payouts/:id/process ─────────────────────
router.put('/payouts/:id/process', async (req, res) => {
  const { id } = req.params;
  const payout = db.prepare("SELECT * FROM payouts WHERE id = ? AND status = 'pending'").get(id);
  
  if (!payout) return res.status(404).json({ error: 'Pending payout not found' });
  
  const driver = db.prepare("SELECT stripe_account_id FROM driver_profiles WHERE user_id = ?").get(payout.driver_id);
  
  if (!driver || !driver.stripe_account_id) {
    db.prepare("UPDATE payouts SET status = 'failed', updated_at = datetime('now') WHERE id = ?").run(id);
    notify(payout.driver_id, 'payment', 'Payout Failed', 'You need to connect your Stripe account to receive payouts.', { payoutId: id });
    return res.status(400).json({ error: 'Driver has no Stripe Connect account' });
  }

  // Set to processing
  db.prepare("UPDATE payouts SET status = 'processing', updated_at = datetime('now') WHERE id = ?").run(id);

  try {
    // Real Stripe API transfer:
    const transfer = await stripe.transfers.create({
      amount: Math.round(payout.amount * 100),
      currency: 'usd',
      destination: driver.stripe_account_id
    });
    
    db.prepare("UPDATE payouts SET status = 'completed', stripe_transfer_id = ?, updated_at = datetime('now') WHERE id = ?").run(transfer.id, id);
    
    // Notify driver
    notify(payout.driver_id, 'payment', 'Payout Processed', `Your payout of $${payout.amount} has been processed via Stripe.`, { payoutId: id });
    pushEvent(payout.driver_id, 'payout_completed', { payoutId: id, amount: payout.amount });

    res.json({ success: true, transfer_id: mockTransferId });
  } catch (error) {
    db.prepare("UPDATE payouts SET status = 'failed', updated_at = datetime('now') WHERE id = ?").run(id);
    res.status(500).json({ error: 'Stripe transfer failed: ' + error.message });
  }
});

export default router;
