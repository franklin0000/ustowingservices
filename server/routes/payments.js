import { Router } from 'express';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';
import { clientOnly } from '../middleware/roles.js';
import { v4 as uuid } from 'uuid';

const router = Router();
router.use(authenticate);
router.use(clientOnly);

// GET /api/payments/my — client's payment history
router.get('/my', (req, res) => {
  const payments = db.prepare(`
    SELECT p.*, j.service_type, j.pickup_location
    FROM payments p JOIN jobs j ON j.id = p.job_id
    WHERE p.client_id = ?
    ORDER BY p.created_at DESC
  `).all(req.user.id);

  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  res.json({
    totalSpent,
    completedCount: payments.filter(p => p.status === 'completed').length,
    pendingCount: payments.filter(p => p.status === 'pending').length,
    payments: payments.map(p => ({
      id: p.id,
      jobId: p.job_id,
      amount: p.amount,
      method: p.method,
      cardLast4: p.card_last4,
      status: p.status,
      serviceType: p.service_type,
      pickupLocation: p.pickup_location,
      date: p.created_at,
    })),
  });
});

// GET /api/payments/methods — list saved payment methods
router.get('/methods', (req, res) => {
  const methods = db.prepare('SELECT * FROM payment_methods WHERE user_id = ? ORDER BY is_default DESC, created_at DESC').all(req.user.id);
  res.json(methods);
});

// POST /api/payments/methods — add a payment method
router.post('/methods', (req, res) => {
  const { cardNumber, expiry } = req.body;
  if (!cardNumber || !expiry) {
    return res.status(400).json({ error: 'Card number and expiry required' });
  }

  // Mock processing
  const last4 = cardNumber.slice(-4);
  const type = 'card';
  // Simple check for visa/mastercard based on first digit
  const provider = cardNumber.startsWith('4') ? 'Visa' : (cardNumber.startsWith('5') ? 'Mastercard' : 'Card');

  const id = uuid();
  // If it's the first card, make it default
  const existing = db.prepare('SELECT COUNT(*) as c FROM payment_methods WHERE user_id = ?').get(req.user.id).c;
  const isDefault = existing === 0 ? 1 : 0;

  db.prepare(`
    INSERT INTO payment_methods (id, user_id, type, provider, last4, expiry, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.user.id, type, provider, last4, expiry, isDefault);

  res.status(201).json({ id, type, provider, last4, expiry, isDefault: !!isDefault });
});

// DELETE /api/payments/methods/:id
router.delete('/methods/:id', (req, res) => {
  db.prepare('DELETE FROM payment_methods WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

export default router;
