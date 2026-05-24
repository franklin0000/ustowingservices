import { v4 as uuid } from 'uuid';
import db from '../db.js';

// In-memory map of userId → Set<WebSocket>
const connections = new Map();

// Register a WebSocket for a user
export function registerSocket(userId, ws) {
  if (!connections.has(userId)) connections.set(userId, new Set());
  connections.get(userId).add(ws);
  ws.on('close', () => {
    connections.get(userId)?.delete(ws);
    if (connections.get(userId)?.size === 0) connections.delete(userId);
  });
}

// Send a real-time event to a specific user
function pushToUser(userId, event) {
  const sockets = connections.get(userId);
  if (!sockets) return;
  const payload = JSON.stringify(event);
  for (const ws of sockets) {
    if (ws.readyState === 1) ws.send(payload);
  }
}

// Broadcast to all connected users with a given role
export function broadcastToRole(role, event) {
  const roleUsers = db.prepare('SELECT id FROM users WHERE role = ?').all(role);
  for (const u of roleUsers) {
    pushToUser(u.id, event);
  }
}

// Create a persistent notification in the DB + push real-time
export function notify(userId, type, title, message, data = null) {
  const id = uuid();
  db.prepare(
    `INSERT INTO notifications (id, user_id, type, title, message, data) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, userId, type, title, message, data ? JSON.stringify(data) : null);

  const notif = { id, type, title, message, data, read: false, created_at: new Date().toISOString() };
  pushToUser(userId, { event: 'notification', payload: notif });
  return notif;
}

// Push a real-time event (no DB persistence) — used for location updates, job status, etc.
export function pushEvent(userId, eventName, payload) {
  pushToUser(userId, { event: eventName, payload });
}

// Get all notifications for a user
export function getUserNotifications(userId, limit = 50) {
  return db.prepare(
    `SELECT id, type, title, message, read, data, created_at
     FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`
  ).all(userId, limit).map(n => ({
    ...n,
    read: !!n.read,
    data: n.data ? JSON.parse(n.data) : null,
  }));
}

// Mark single or all notifications as read
export function markRead(userId, notifId) {
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?').run(notifId, userId);
}

export function markAllRead(userId) {
  db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(userId);
}

export function getUnreadCount(userId) {
  return db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0').get(userId).count;
}
