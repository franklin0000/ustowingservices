import { WebSocketServer } from 'ws';
import db from './db.js';
import { verifyToken } from './middleware/auth.js';
import { registerSocket } from './services/notifications.js';
import { processDriverTelemetry, joinJobTracking, leaveJobTracking } from './services/realtimeTracker.js';

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    // Extract token from query string: ws://host/ws?token=xxx
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(4001, 'Token required');
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      ws.close(4002, 'Invalid token');
      return;
    }

    // Verify user is active in DB (prevent suspended or deleted user access)
    const user = db.prepare('SELECT id, role, status FROM users WHERE id = ?').get(decoded.id);
    if (!user || user.status === 'suspended') {
      ws.close(4003, 'User inactive or suspended');
      return;
    }

    // Register this socket for real-time push events
    registerSocket(decoded.id, ws);
    console.log(`  WS connected: ${decoded.email} (${user.role})`);

    // Send a welcome message
    ws.send(JSON.stringify({
      event: 'connected',
      payload: { userId: decoded.id, role: decoded.role },
    }));

    // Handle incoming messages from client
    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data);
        if (msg.type === 'ping') {
          ws.send(JSON.stringify({ event: 'pong', payload: { time: Date.now() } }));
        } else if (msg.type === 'telemetry' && decoded.role === 'driver') {
          // Driver GPS telemetry ping
          const feature = processDriverTelemetry({
            driverId: decoded.id,
            lat: msg.lat,
            lng: msg.lng,
            heading: msg.heading,
            speed: msg.speed,
            activeJobId: msg.jobId,
            destLat: msg.destLat,
            destLng: msg.destLng,
          });
          ws.send(JSON.stringify({ event: 'telemetry_ack', payload: { timestamp: Date.now() } }));
        } else if (msg.type === 'subscribe_job' && msg.jobId) {
          // Client or Admin joins live tracking room for a job
          joinJobTracking(msg.jobId, ws);
          ws.send(JSON.stringify({ event: 'subscribed_job', payload: { jobId: msg.jobId } }));
        } else if (msg.type === 'unsubscribe_job' && msg.jobId) {
          leaveJobTracking(msg.jobId, ws);
        }
      } catch { /* ignore malformed messages */ }
    });

    ws.on('close', () => {
      console.log(`  WS disconnected: ${decoded.email}`);
    });
  });

  console.log('  WebSocket server ready on /ws');
  return wss;
}
