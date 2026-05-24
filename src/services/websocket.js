import { getToken } from './api';

let ws = null;
let reconnectTimer = null;
const listeners = new Map(); // event → Set<callback>

export function connectWS() {
  const token = getToken();
  if (!token || ws?.readyState === WebSocket.OPEN) return;

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  ws = new WebSocket(`${protocol}//${host}/ws?token=${token}`);

  ws.onopen = () => {
    console.log('[WS] Connected');
    clearTimeout(reconnectTimer);
  };

  ws.onmessage = (evt) => {
    try {
      const { event, payload } = JSON.parse(evt.data);
      const cbs = listeners.get(event);
      if (cbs) cbs.forEach(cb => cb(payload));
      // Also fire wildcard listeners
      const wild = listeners.get('*');
      if (wild) wild.forEach(cb => cb(event, payload));
    } catch { /* ignore */ }
  };

  ws.onclose = () => {
    console.log('[WS] Disconnected, reconnecting in 3s...');
    reconnectTimer = setTimeout(connectWS, 3000);
  };

  ws.onerror = () => {
    ws?.close();
  };
}

export function disconnectWS() {
  clearTimeout(reconnectTimer);
  if (ws) {
    ws.onclose = null; // prevent auto-reconnect
    ws.close();
    ws = null;
  }
}

export function onEvent(event, callback) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(callback);
  // Return unsubscribe function
  return () => listeners.get(event)?.delete(callback);
}

export function sendMessage(data) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}
