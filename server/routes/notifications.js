import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getUserNotifications, markRead, markAllRead, getUnreadCount } from '../services/notifications.js';

const router = Router();
router.use(authenticate);

// GET /api/notifications — get all notifications for current user
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const notifications = getUserNotifications(req.user.id, limit);
  const unreadCount = getUnreadCount(req.user.id);
  res.json({ notifications, unreadCount });
});

// PUT /api/notifications/:id/read — mark one as read
router.put('/:id/read', (req, res) => {
  markRead(req.user.id, req.params.id);
  res.json({ success: true });
});

// PUT /api/notifications/read-all — mark all as read
router.put('/read-all', (req, res) => {
  markAllRead(req.user.id);
  res.json({ success: true });
});

export default router;
