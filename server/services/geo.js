import db from '../db.js';

const EARTH_RADIUS_KM = 6371;

// Haversine formula: distance between two coordinates in km
export function haversine(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Find available drivers within a radius, sorted by distance
export function findNearbyDrivers(lat, lng, radiusKm = 15) {
  const allAvailable = db.prepare(`
    SELECT dp.*, u.name, u.phone, u.email
    FROM driver_profiles dp
    JOIN users u ON u.id = dp.user_id
    WHERE dp.available = 1 AND u.status = 'active'
  `).all();

  return allAvailable
    .map((d) => ({
      ...d,
      distance: haversine(lat, lng, d.latitude, d.longitude),
    }))
    .filter((d) => d.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

// Pick the best driver: closest + highest rated
export function findBestDriver(lat, lng, radiusKm = 15) {
  const nearby = findNearbyDrivers(lat, lng, radiusKm);
  if (nearby.length === 0) return null;

  // Score = rating weight (0.4) + proximity weight (0.6)
  const maxDist = Math.max(...nearby.map((d) => d.distance), 1);
  return nearby
    .map((d) => ({
      ...d,
      score: (d.rating / 5) * 0.4 + (1 - d.distance / maxDist) * 0.6,
    }))
    .sort((a, b) => b.score - a.score)[0];
}

// Estimate ETA in minutes based on distance (avg 30 km/h in city)
export function estimateETA(driverLat, driverLng, pickupLat, pickupLng) {
  const dist = haversine(driverLat, driverLng, pickupLat, pickupLng);
  return Math.max(2, Math.round((dist / 30) * 60));
}

// Update driver GPS position
export function updateDriverLocation(userId, lat, lng) {
  db.prepare(
    `UPDATE driver_profiles SET latitude = ?, longitude = ?, updated_at = datetime('now') WHERE user_id = ?`
  ).run(lat, lng, userId);
}
