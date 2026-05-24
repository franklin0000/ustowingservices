import { WebSocketServer } from 'ws';
import { verifyToken } from './middleware/auth.js';
import { registerSocket } from './services/notifications.js';

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

    // Register this socket for real-time push events
    registerSocket(decoded.id, ws);
    console.log(`  WS connected: ${decoded.email} (${decoded.role})`);

    // Send a welcome message
    ws.send(JSON.stringify({
      event: 'connected',
      payload: { userId: decoded.id, role: decoded.role },
    }));

    // Handle incoming messages from client (e.g., ping or location updates)
    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data);
        if (msg.type === 'ping') {
          ws.send(JSON.stringify({ event: 'pong', payload: { time: Date.now() } }));
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
