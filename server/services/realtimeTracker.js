/**
 * Real-Time Telemetry & Tracking Engine
 * US Towing Services - Global Backend
 * 
 * Manages low-latency driver GPS telemetry, active job tracking rooms,
 * and geo-partitioned broadcasting using Mapbox-compatible GeoJSON formats.
 */

import { getGeoShardKey, getAdjacentShardKeys } from './geoSharding.js';
import { updateDriverLocation, estimateETA, haversine } from './geo.js';

// In-memory active tracking rooms: jobId -> Set<WebSocket>
const jobTrackingRooms = new Map();

// Local driver telemetry cache: driverId -> { lat, lng, heading, speed, updatedAt, shardKey }
const activeDriverPositions = new Map();

// Minimum time threshold between DB persistence writes to avoid I/O saturation (3 seconds)
const DB_FLUSH_INTERVAL_MS = 3000;
const lastDbFlush = new Map();

/**
 * Client or Admin subscribes to live tracking for a specific job
 */
export function joinJobTracking(jobId, ws) {
  if (!jobTrackingRooms.has(jobId)) {
    jobTrackingRooms.set(jobId, new Set());
  }
  jobTrackingRooms.get(jobId).add(ws);

  ws.on('close', () => {
    leaveJobTracking(jobId, ws);
  });
}

/**
 * Unsubscribes socket from job tracking
 */
export function leaveJobTracking(jobId, ws) {
  const room = jobTrackingRooms.get(jobId);
  if (room) {
    room.delete(ws);
    if (room.size === 0) {
      jobTrackingRooms.delete(jobId);
    }
  }
}

/**
 * Ingests incoming driver GPS telemetry
 * @param {Object} telemetry { driverId, lat, lng, heading, speed, accuracy, activeJobId, destLat, destLng }
 */
export function processDriverTelemetry(telemetry) {
  const { driverId, lat, lng, heading = 0, speed = 0, activeJobId, destLat, destLng } = telemetry;
  if (!driverId || typeof lat !== 'number' || typeof lng !== 'number') return null;

  const now = Date.now();
  const shardKey = getGeoShardKey(lat, lng);

  // Update in-memory high-frequency state
  activeDriverPositions.set(driverId, {
    driverId,
    lat,
    lng,
    heading,
    speed,
    shardKey,
    updatedAt: now,
  });

  // Calculate dynamic ETA if destination exists
  let etaMinutes = null;
  if (destLat && destLng) {
    etaMinutes = estimateETA(lat, lng, destLat, destLng);
  }

  // Construct standardized Mapbox GeoJSON Feature for smooth client interpolation
  const geoJsonPayload = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lng, lat], // Mapbox / GeoJSON standard: [lng, lat]
    },
    properties: {
      driverId,
      heading,
      speed,
      etaMinutes,
      shardKey,
      timestamp: now,
    },
  };

  // Broadcast to active job tracking room if driver is currently assigned
  if (activeJobId && jobTrackingRooms.has(activeJobId)) {
    const message = JSON.stringify({
      event: 'job_telemetry',
      payload: {
        jobId: activeJobId,
        telemetry: geoJsonPayload,
      },
    });

    const room = jobTrackingRooms.get(activeJobId);
    for (const clientWs of room) {
      if (clientWs.readyState === 1) { // OPEN
        clientWs.send(message);
      }
    }
  }

  // Throttled persistence write to SQLite/Postgres (once every 3 seconds per driver)
  const lastFlush = lastDbFlush.get(driverId) || 0;
  if (now - lastFlush >= DB_FLUSH_INTERVAL_MS) {
    try {
      updateDriverLocation(driverId, lat, lng);
      lastDbFlush.set(driverId, now);
    } catch (err) {
      console.warn(`[Telemetry] Failed to persist location for driver ${driverId}:`, err.message);
    }
  }

  return geoJsonPayload;
}

/**
 * Queries drivers active within neighboring geographic shards
 */
export function queryDriversInGeoShards(lat, lng, radiusKm = 25) {
  const adjacentKeys = new Set(getAdjacentShardKeys(lat, lng));
  const results = [];

  for (const [driverId, pos] of activeDriverPositions.entries()) {
    if (adjacentKeys.has(pos.shardKey)) {
      const distance = haversine(lat, lng, pos.lat, pos.lng);
      if (distance <= radiusKm) {
        results.push({ ...pos, distance });
      }
    }
  }

  return results.sort((a, b) => a.distance - b.distance);
}
