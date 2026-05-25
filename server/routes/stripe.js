import { Router } from 'express';
import Stripe from 'stripe';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { v4 as uuid } from 'uuid';
import { pushEvent } from '../services/notifications.js';

const rawKey = process.env.STRIPE_SECRET_KEY_B64 
  ? Buffer.from(process.env.STRIPE_SECRET_KEY_B64, 'base64').toString('ascii') 
  : process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';

const stripe = new Stripe(rawKey, {
  apiVersion: '2023-10-16',
});

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ── CREATE PORTAL SESSION FOR CLIENT/DRIVER BILLING ────────────────────────
router.post('/create-portal-session', authenticate, async (req, res) => {
  try {
    let customerId = req.user.stripe_customer_id;

    if (!customerId) {
      // Create a new customer in Stripe if they don't have one
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: { userId: req.user.id }
      });
      customerId = customer.id;
      // Save it in DB
      db.prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ?').run(customerId, req.user.id);
      req.user.stripe_customer_id = customerId; // update in memory for this request
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${FRONTEND_URL}/history`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CREATE CHECKOUT FOR DRIVER SUBSCRIPTION ────────────────────────
router.post('/create-subscription-checkout', authenticate, async (req, res) => {
  if (req.user.role !== 'driver') {
    return res.status(403).json({ error: 'Only drivers can subscribe' });
  }

  const { plan } = req.body; // 'daily' | 'monthly'
  if (!['daily', 'monthly'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  try {
    const priceAmount = plan === 'daily' ? 3000 : 5000; // $30.00 or $50.00
    const planName = plan === 'daily' ? 'Gruas 24-Hour Pass' : 'Gruas Pro Monthly Pass';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planName,
              description: 'Access to towing requests and advanced features',
            },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${FRONTEND_URL}/driver?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/driver`,
      client_reference_id: req.user.id,
      metadata: {
        type: 'subscription',
        driver_id: req.user.id,
        plan: plan
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CREATE CHECKOUT FOR CLIENT JOB PAYMENT ─────────────────────────
router.post('/create-job-checkout', authenticate, async (req, res) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ error: 'Only clients can pay for jobs' });
  }

  const { jobId } = req.body;
  const job = db.prepare('SELECT * FROM jobs WHERE id = ? AND client_id = ?').get(jobId, req.user.id);
  
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (job.status !== 'completed' && job.status !== 'negotiating') {
    return res.status(400).json({ error: 'Job is not ready for payment' });
  }

  // Check if payment already exists
  const existingPayment = db.prepare('SELECT * FROM payments WHERE job_id = ?').get(jobId);
  if (existingPayment && existingPayment.status === 'completed') {
    return res.status(400).json({ error: 'Job is already paid for' });
  }

  try {
    const isNegotiating = job.status === 'negotiating';
    const finalAmount = isNegotiating ? job.agreed_price : job.amount;
    
    if (!finalAmount) {
      return res.status(400).json({ error: 'Amount not set' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Gruas Service - ${job.service_type}`,
              description: isNegotiating ? `Agreed service fee` : `From ${job.pickup_location} to ${job.destination || 'Resolved on site'}`,
            },
            unit_amount: Math.round(finalAmount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${FRONTEND_URL}/track?payment=${isNegotiating ? 'success_negotiating' : 'success'}&job_id=${job.id}`,
      cancel_url: `${FRONTEND_URL}/track?payment=cancelled`,
      client_reference_id: req.user.id,
      metadata: {
        type: 'job_payment',
        job_id: job.id,
        client_id: job.client_id,
        driver_id: job.driver_id,
        amount: finalAmount,
        status_at_payment: job.status
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── STRIPE CONNECT (EXPRESS) ───────────────────────────────────────
router.post('/connect', authenticate, async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Only drivers can connect to Stripe' });
  
  try {
    let accountId = db.prepare("SELECT stripe_account_id FROM driver_profiles WHERE user_id = ?").get(req.user.id)?.stripe_account_id;
    
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: req.user.email,
        capabilities: {
          transfers: { requested: true },
        },
        business_type: 'individual',
      });
      accountId = account.id;
      db.prepare("UPDATE driver_profiles SET stripe_account_id = ?, updated_at = datetime('now') WHERE user_id = ?").run(accountId, req.user.id);
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${FRONTEND_URL}/driver`,
      return_url: `${FRONTEND_URL}/driver?stripe_return=true`,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/connect/status', authenticate, async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Only drivers can check Stripe status' });
  
  try {
    const accountId = db.prepare("SELECT stripe_account_id FROM driver_profiles WHERE user_id = ?").get(req.user.id)?.stripe_account_id;
    if (!accountId) return res.json({ connected: false });
    
    let account;
    try {
      account = await stripe.accounts.retrieve(accountId);
    } catch (retrieveErr) {
      // If the account doesn't exist in Stripe (e.g., from old mock data), clear it.
      db.prepare("UPDATE driver_profiles SET stripe_account_id = NULL WHERE user_id = ?").run(req.user.id);
      return res.json({ connected: false });
    }
    
    // Express accounts need charges_enabled and details_submitted to receive transfers
    const isReady = account.charges_enabled && account.details_submitted;
    
    if (isReady) {
      db.prepare("UPDATE driver_profiles SET kyc_status = 'approved' WHERE user_id = ?").run(req.user.id);
    }
    
    res.json({ connected: isReady });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── STRIPE WEBHOOK ──────────────────────────────────────────────────
// Note: Webhook expects raw body, so we export a special router config or just use JSON if bypassing signature checks for local dev.
// We'll trust the payload structure for demonstration purposes.
router.post('/webhook', async (req, res) => {
  const event = req.body;

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata;

    if (metadata.type === 'subscription') {
      const { driver_id, plan } = metadata;
      
      const expiresAt = new Date();
      if (plan === 'daily') {
        expiresAt.setHours(expiresAt.getHours() + 24);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }
      
      const amount = plan === 'daily' ? 30.0 : 50.0;

      db.prepare(`
        INSERT INTO subscriptions (id, driver_id, plan_type, status, amount, expires_at)
        VALUES (?, ?, ?, 'active', ?, ?)
      `).run(uuid(), driver_id, plan, amount, expiresAt.toISOString());

    } else if (metadata.type === 'job_payment') {
      const { job_id, client_id, driver_id, amount, status_at_payment } = metadata;
      const amtNum = parseFloat(amount);
      const platformFee = amtNum * 0.25; // 25% platform fee
      const driverPayout = amtNum - platformFee;

      db.prepare(`
        INSERT INTO payments (id, job_id, client_id, driver_id, amount, platform_fee, driver_payout, method, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'card', 'completed')
      `).run(uuid(), job_id, client_id, driver_id, amtNum, platformFee, driverPayout);

      if (status_at_payment === 'negotiating') {
        db.prepare(`UPDATE jobs SET status = 'en_route', updated_at = datetime('now') WHERE id = ?`).run(job_id);
        
        const msgId = uuid();
        db.prepare(`
          INSERT INTO chat_messages (id, job_id, sender_id, receiver_id, message)
          VALUES (?, ?, ?, ?, ?)
        `).run(msgId, job_id, client_id, driver_id, 'Payment completed. Service will commence now.');

        pushEvent(driver_id, 'job_status', { jobId: job_id, status: 'en_route' });
        pushEvent(driver_id, 'chat_message', {
          id: msgId, jobId: job_id, senderId: client_id, receiverId: driver_id,
          message: 'Payment completed. Service will commence now.',
          timestamp: new Date().toISOString(),
        });
        
        // Also notify client if they are listening
        pushEvent(client_id, 'job_status', { jobId: job_id, status: 'en_route' });
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

// ── DEV MODE BYPASS ROUTES (DISABLED STRIPE UNTIL 100% READY) ───────
router.post('/bypass-subscription', authenticate, async (req, res) => {
  if (req.user.role !== 'driver') return res.status(403).json({ error: 'Only drivers' });
  
  const { plan } = req.body;
  const expiresAt = new Date();
  if (plan === 'daily') expiresAt.setHours(expiresAt.getHours() + 24);
  else expiresAt.setMonth(expiresAt.getMonth() + 1);
  
  const amount = plan === 'daily' ? 30.0 : 50.0;

  db.prepare(`
    INSERT INTO subscriptions (id, driver_id, plan_type, status, amount, expires_at)
    VALUES (?, ?, ?, 'active', ?, ?)
  `).run(uuid(), req.user.id, plan, amount, expiresAt.toISOString());

  res.json({ success: true, bypassed: true });
});

router.post('/bypass-job-payment', authenticate, async (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({ error: 'Only clients' });
  
  const { jobId } = req.body;
  const job = db.prepare('SELECT * FROM jobs WHERE id = ? AND client_id = ?').get(jobId, req.user.id);
  
  if (job.status !== 'completed' && job.status !== 'negotiating') return res.status(400).json({ error: 'Invalid job status' });

  const amtNum = job.status === 'negotiating' ? parseFloat(job.agreed_price) : parseFloat(job.amount);
  if (!amtNum) return res.status(400).json({ error: 'Invalid amount' });

  const platformFee = amtNum * 0.25;
  const driverPayout = amtNum - platformFee;

  db.prepare(`
    INSERT INTO payments (id, job_id, client_id, driver_id, amount, platform_fee, driver_payout, method, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'bypass', 'completed')
  `).run(uuid(), job.id, job.client_id, job.driver_id, amtNum, platformFee, driverPayout);

  if (job.status === 'negotiating') {
    db.prepare(`UPDATE jobs SET status = 'en_route', updated_at = datetime('now') WHERE id = ?`).run(job.id);
    
    // Send system chat message
    const msgId = uuid();
    db.prepare(`
      INSERT INTO chat_messages (id, job_id, sender_id, receiver_id, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(msgId, job.id, job.client_id, job.driver_id, 'Payment completed. Service will commence now.');

    // Notify Driver
    pushEvent(job.driver_id, 'job_status', { jobId: job.id, status: 'en_route' });
    pushEvent(job.driver_id, 'chat_message', {
      id: msgId, jobId: job.id, senderId: job.client_id, receiverId: job.driver_id,
      message: 'Payment completed. Service will commence now.',
      timestamp: new Date().toISOString(),
    });
    
    res.json({ success: true, bypassed: true, nextStatus: 'en_route' });
  } else {
    res.json({ success: true, bypassed: true });
  }
});

export default router;
