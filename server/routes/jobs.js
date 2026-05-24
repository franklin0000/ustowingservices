import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { clientOnly, driverOnly } from '../middleware/roles.js';
import { findBestDriver, findNearbyDrivers, estimateETA, haversine } from '../services/geo.js';
import { notify, pushEvent, broadcastToRole } from '../services/notifications.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ── CLIENT: Get nearby drivers ────────────────────────────────
router.get('/nearby-drivers', clientOnly, (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });
  const drivers = findNearbyDrivers(parseFloat(lat), parseFloat(lng), 15); // 15km radius
  res.json(drivers.map(d => ({
    id: d.user_id,
    name: d.name,
    latitude: d.latitude,
    longitude: d.longitude,
    vehicle: d.vehicle
  })));
});

// ── CLIENT: Create a new service request ────────────────────
router.post('/', clientOnly, (req, res) => {
  const {
    serviceType, vehicleType, vehicleDetails,
    pickupLocation, pickupLat, pickupLng,
    destination, destLat, destLng,
    amount, notes,
  } = req.body;

  if (!serviceType || !vehicleType || !pickupLocation || !pickupLat || !pickupLng || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = uuid();
  db.prepare(`
    INSERT INTO jobs (id, client_id, service_type, vehicle_type, vehicle_details,
      pickup_location, pickup_lat, pickup_lng, destination, dest_lat, dest_lng, amount, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.user.id, serviceType, vehicleType, vehicleDetails || null,
    pickupLocation, pickupLat, pickupLng, destination || null, destLat || null, destLng || null,
    amount, notes || null);

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);

  // Attempt auto-matching: find best driver
  const setting = db.prepare("SELECT value FROM platform_settings WHERE key = 'auto_assign'").get();
  if (setting?.value === 'true') {
    const radiusSetting = db.prepare("SELECT value FROM platform_settings WHERE key = 'max_search_radius_km'").get();
    const radius = parseFloat(radiusSetting?.value || '15');
    const best = findBestDriver(pickupLat, pickupLng, radius);

    if (best) {
      // Notify best driver of new job
      notify(best.user_id, 'job', 'New Service Request',
        `${req.user.name} needs ${serviceType} service at ${pickupLocation}`,
        { jobId: id }
      );
    }
  }

  // Notify all available drivers in range
  const nearby = findNearbyDrivers(pickupLat, pickupLng);
  for (const driver of nearby) {
    pushEvent(driver.user_id, 'new_job', {
      jobId: id,
      serviceType,
      pickupLocation,
      amount,
      clientName: req.user.name,
    });
  }

  res.status(201).json(formatJob(job));
});

// ── CLIENT: Get my jobs ─────────────────────────────────────
router.get('/my', clientOnly, (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM jobs WHERE client_id = ?';
  const params = [req.user.id];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  sql += ' ORDER BY created_at DESC';

  const jobs = db.prepare(sql).all(...params).map(formatJob);
  res.json(jobs);
});

// ── DRIVER: Get available (pending) jobs nearby ─────────────
router.get('/available', driverOnly, (req, res) => {
  const dp = db.prepare('SELECT * FROM driver_profiles WHERE user_id = ?').get(req.user.id);
  if (!dp) return res.status(404).json({ error: 'Driver profile not found' });

  const radiusSetting = db.prepare("SELECT value FROM platform_settings WHERE key = 'max_search_radius_km'").get();
  const radius = parseFloat(radiusSetting?.value || '15');

  const pending = db.prepare(`
    SELECT j.*, u.name as client_name, u.phone as client_phone, u.avatar as client_avatar
    FROM jobs j JOIN users u ON u.id = j.client_id
    WHERE j.status = 'pending' ORDER BY j.created_at DESC
  `).all();

  // For testing purposes, we remove the strict distance filter 
  // so jobs appear regardless of the client/driver map location differences
  const nearbyJobs = pending.map(j => {
    const dist = haversine(dp.latitude, dp.longitude, j.pickup_lat, j.pickup_lng);
    j._distance = dist;
    if (j.dest_lat && j.dest_lng) {
      j._tripDistance = haversine(j.pickup_lat, j.pickup_lng, j.dest_lat, j.dest_lng);
    }
    return j;
  }).sort((a, b) => a._distance - b._distance);

  res.json(nearbyJobs.map(j => ({
    ...formatJob(j),
    clientName: j.client_name,
    clientPhone: j.client_phone,
    clientAvatar: j.client_avatar,
    distance: Math.round(j._distance * 10) / 10,
    tripDistance: j._tripDistance != null ? Math.round(j._tripDistance * 10) / 10 : null,
  })));
});

// ── DRIVER: Propose a final price for negotiation ───────────
router.post('/:id/propose-price', driverOnly, (req, res) => {
  const { amount } = req.body;
  const job = db.prepare('SELECT * FROM jobs WHERE id = ? AND driver_id = ?').get(req.params.id, req.user.id);
  
  if (!job) return res.status(404).json({ error: 'Job not found or not assigned to you' });
  if (job.status !== 'negotiating') return res.status(400).json({ error: 'Job is not in negotiating status' });
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid price' });

  db.prepare(`UPDATE jobs SET agreed_price = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(amount, job.id);

  // Send a special system message to the chat using the driver's ID
  const msgId = uuid();
  db.prepare(`
    INSERT INTO chat_messages (id, job_id, sender_id, receiver_id, message)
    VALUES (?, ?, ?, ?, ?)
  `).run(msgId, job.id, req.user.id, job.client_id, `I have proposed a final price of $${amount}. Please review and pay.`);

  // Notify client
  pushEvent(job.client_id, 'chat_message', {
    id: msgId, jobId: job.id, senderId: req.user.id,
    message: `I have proposed a final price of $${amount}. Please review and pay.`,
    timestamp: new Date().toISOString(),
  });
  
  pushEvent(job.client_id, 'price_proposed', { jobId: job.id, amount });

  res.json({ success: true, amount });
});

// ── DRIVER: Accept a job ────────────────────────────────────
router.put('/:id/accept', driverOnly, (req, res) => {
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.status !== 'pending') {
    return res.status(400).json({ error: 'Job is no longer available' });
  }

  // Check driver doesn't already have an active job
  const active = db.prepare(
    `SELECT id FROM jobs WHERE driver_id = ? AND status IN ('accepted','negotiating','en_route','arrived','in_service')`
  ).get(req.user.id);
  if (active) {
    return res.status(400).json({ error: 'You already have an active job' });
  }

  const nextStatus = 'negotiating';

  db.prepare(`
    UPDATE jobs SET driver_id = ?, status = ?, updated_at = datetime('now') WHERE id = ?
  `).run(req.user.id, nextStatus, job.id);

  db.prepare('UPDATE driver_profiles SET available = 0, updated_at = datetime(\'now\') WHERE user_id = ?')
    .run(req.user.id);

  const dp = db.prepare('SELECT * FROM driver_profiles WHERE user_id = ?').get(req.user.id);
  const eta = estimateETA(dp.latitude, dp.longitude, job.pickup_lat, job.pickup_lng);

  // Notify the client
  if (nextStatus === 'negotiating') {
    notify(job.client_id, 'job', 'Driver Available for Negotiation',
      `${req.user.name} is available. Please negotiate the final price in the chat.`,
      { jobId: job.id, driverId: req.user.id }
    );
    pushEvent(job.client_id, 'job_negotiating', {
      jobId: job.id,
      driver: { id: req.user.id, name: req.user.name, phone: req.user.phone, avatar: req.user.avatar, vehicle: dp.vehicle, rating: dp.rating },
    });
  } else {
    notify(job.client_id, 'job', 'Driver Assigned!',
      `${req.user.name} is on the way with their ${dp.vehicle}. ETA: ${eta} min`,
      { jobId: job.id, driverId: req.user.id, eta }
    );
    pushEvent(job.client_id, 'job_accepted', {
      jobId: job.id,
      driver: { id: req.user.id, name: req.user.name, phone: req.user.phone, avatar: req.user.avatar, vehicle: dp.vehicle, rating: dp.rating, lat: dp.latitude, lng: dp.longitude },
      eta,
    });
  }

  const updated = db.prepare('SELECT * FROM jobs WHERE id = ?').get(job.id);
  res.json({ ...formatJob(updated), eta });
});

// ── DRIVER: Update job status (advance through stages) ──────
router.put('/:id/status', driverOnly, (req, res) => {
  const { status } = req.body;
  const validTransitions = {
    accepted: ['en_route'],
    en_route: ['arrived'],
    arrived: ['in_service'],
    in_service: ['completed'],
  };

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.driver_id !== req.user.id) {
    return res.status(403).json({ error: 'Not your job' });
  }

  const allowed = validTransitions[job.status];
  if (!allowed || !allowed.includes(status)) {
    return res.status(400).json({ error: `Cannot transition from ${job.status} to ${status}` });
  }

  const updates = { status, updated_at: "datetime('now')" };
  if (status === 'completed') {
    // Complete the job: create payment, update driver stats
    db.prepare(`
      UPDATE jobs SET status = 'completed', completed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?
    `).run(job.id);

    const feePct = parseFloat(
      db.prepare("SELECT value FROM platform_settings WHERE key = 'platform_fee_pct'").get()?.value || '5'
    ) / 100;
    const actualAmount = job.agreed_price || job.amount;
    const platformFee = actualAmount * feePct;
    const driverPayout = actualAmount - platformFee;

    db.prepare(`
      INSERT INTO payments (id, job_id, client_id, driver_id, amount, platform_fee, driver_payout, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'completed')
    `).run(uuid(), job.id, job.client_id, job.driver_id, actualAmount, platformFee, driverPayout);

    db.prepare(`
      UPDATE driver_profiles SET
        available = 1,
        completed_jobs = completed_jobs + 1,
        total_earnings = total_earnings + ?,
        updated_at = datetime('now')
      WHERE user_id = ?
    `).run(driverPayout, req.user.id);

    notify(job.client_id, 'payment', 'Service Completed',
      `Your ${job.service_type} service is complete. Amount: $${job.amount}`,
      { jobId: job.id }
    );
    pushEvent(job.client_id, 'job_status', { jobId: job.id, status: 'completed', message: 'Service completed' });
    
    notify(req.user.id, 'payment', 'Job Completed!',
      `Earned $${driverPayout.toFixed(2)} for ${job.service_type} service`,
      { jobId: job.id, payout: driverPayout }
    );
  } else {
    db.prepare(`UPDATE jobs SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, job.id);
    // Notify client of status change
    const statusLabels = { en_route: 'Driver is on the way', arrived: 'Driver has arrived', in_service: 'Service in progress' };
    pushEvent(job.client_id, 'job_status', { jobId: job.id, status, message: statusLabels[status] });
  }

  const updated = db.prepare('SELECT * FROM jobs WHERE id = ?').get(job.id);
  res.json(formatJob(updated));
});

// ── CLIENT: Rate a completed job ────────────────────────────
router.put('/:id/rate', clientOnly, (req, res) => {
  const { rating, review } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be 1-5' });
  }

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.client_id !== req.user.id) return res.status(403).json({ error: 'Not your job' });
  if (job.status !== 'completed') return res.status(400).json({ error: 'Job not completed' });
  if (job.rating) return res.status(400).json({ error: 'Already rated' });

  db.prepare('UPDATE jobs SET rating = ?, review = ? WHERE id = ?').run(rating, review || null, job.id);

  // Update driver's average rating
  if (job.driver_id) {
    const dp = db.prepare('SELECT * FROM driver_profiles WHERE user_id = ?').get(job.driver_id);
    const newTotal = dp.total_ratings + 1;
    const newRating = ((dp.rating * dp.total_ratings) + rating) / newTotal;
    db.prepare('UPDATE driver_profiles SET rating = ?, total_ratings = ? WHERE user_id = ?')
      .run(Math.round(newRating * 10) / 10, newTotal, job.driver_id);

    notify(job.driver_id, 'rating', 'New Rating',
      `${req.user.name} rated your service ${rating} stars`,
      { jobId: job.id, rating }
    );
  }

  res.json({ success: true });
});

// ── CLIENT: Cancel a pending job ────────────────────────────
router.put('/:id/cancel', clientOnly, (req, res) => {
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.client_id !== req.user.id) return res.status(403).json({ error: 'Not your job' });
  if (!['pending', 'accepted', 'negotiating'].includes(job.status)) {
    return res.status(400).json({ error: 'Can only cancel pending, accepted, or negotiating jobs' });
  }

  db.prepare("UPDATE jobs SET status = 'cancelled', updated_at = datetime('now') WHERE id = ?").run(job.id);

  if (job.driver_id) {
    db.prepare("UPDATE driver_profiles SET available = 1, updated_at = datetime('now') WHERE user_id = ?")
      .run(job.driver_id);
    notify(job.driver_id, 'job', 'Job Cancelled', `${req.user.name} cancelled the ${job.service_type} request`);
    pushEvent(job.driver_id, 'job_cancelled', { jobId: job.id });
  }

  res.json({ success: true });
});

// ── CHAT: Get messages for a job ────────────────────────────
router.get('/:id/chat', (req, res) => {
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (req.user.role === 'client' && job.client_id !== req.user.id) return res.status(403).json({ error: 'Access denied' });
  if (req.user.role === 'driver' && job.driver_id !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  const messages = db.prepare('SELECT * FROM chat_messages WHERE job_id = ? ORDER BY created_at ASC').all(job.id);
  res.json(messages.map(m => ({
    id: m.id,
    jobId: m.job_id,
    senderId: m.sender_id,
    receiverId: m.receiver_id,
    message: m.message,
    read: m.read,
    createdAt: m.created_at,
  })));
});

// ── CHAT: Send a message ────────────────────────────────────
router.post('/:id/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  
  let receiverId;
  if (req.user.role === 'client' && job.client_id === req.user.id) {
    receiverId = job.driver_id;
  } else if (req.user.role === 'driver' && job.driver_id === req.user.id) {
    receiverId = job.client_id;
  } else {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (!receiverId) return res.status(400).json({ error: 'No receiver available yet' });

  const msgId = uuid();
  db.prepare(`
    INSERT INTO chat_messages (id, job_id, sender_id, receiver_id, message)
    VALUES (?, ?, ?, ?, ?)
  `).run(msgId, job.id, req.user.id, receiverId, message);

  const newMsg = db.prepare('SELECT * FROM chat_messages WHERE id = ?').get(msgId);
  const formattedMsg = {
    id: newMsg.id, jobId: newMsg.job_id, senderId: newMsg.sender_id,
    receiverId: newMsg.receiver_id, message: newMsg.message,
    read: newMsg.read, createdAt: newMsg.created_at
  };

  // Push event in real time via WebSockets
  pushEvent(receiverId, 'chat_message', formattedMsg);

  res.status(201).json(formattedMsg);
});

// ── GET single job (client sees own, driver sees assigned) ──
router.get('/:id', (req, res) => {
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  // Permission check: only own jobs or admin
  if (req.user.role === 'client' && job.client_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  if (req.user.role === 'driver' && job.driver_id !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const enriched = formatJob(job);

  if (job.dest_lat && job.dest_lng) {
    enriched.tripDistance = Math.round(haversine(job.pickup_lat, job.pickup_lng, job.dest_lat, job.dest_lng) * 10) / 10;
  }

  // Attach driver info for clients
  if (job.driver_id && req.user.role === 'client') {
    const driver = db.prepare(`
      SELECT u.name, u.phone, u.avatar, dp.vehicle, dp.rating, dp.completed_jobs, dp.latitude, dp.longitude
      FROM users u JOIN driver_profiles dp ON dp.user_id = u.id WHERE u.id = ?
    `).get(job.driver_id);
    enriched.driver = driver;
  }

  // Attach client info for drivers
  if (req.user.role === 'driver') {
    const client = db.prepare('SELECT name, phone, avatar FROM users WHERE id = ?').get(job.client_id);
    enriched.client = client;
  }

  res.json(enriched);
});

// Helper: format job row for JSON response
function formatJob(row) {
  return {
    id: row.id,
    clientId: row.client_id,
    driverId: row.driver_id,
    serviceType: row.service_type,
    vehicleType: row.vehicle_type,
    vehicleDetails: row.vehicle_details,
    pickupLocation: row.pickup_location,
    pickupLat: row.pickup_lat,
    pickupLng: row.pickup_lng,
    destination: row.destination,
    destLat: row.dest_lat,
    destLng: row.dest_lng,
    status: row.status,
    amount: row.amount,
    agreedPrice: row.agreed_price,
    notes: row.notes,
    rating: row.rating,
    review: row.review,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
  };
}

export default router;
