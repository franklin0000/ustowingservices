/**
 * Geographic Sharding Service (Geo-Sharding Engine)
 * US Towing Services - Global Scale Architecture
 * 
 * Partitions world geography into discrete hierarchical cells using Geohash / Region routing.
 * Ensures driver telemetry, job requests, and WebSocket rooms are partitioned locally
 * without cross-continental message broadcast bottlenecks.
 */

// Global Region Topologies & Datacenter assignments
export const REGIONS = {
  'NA_EAST':  { id: 'na-east',  name: 'North America East (N. Virginia)', latMin: 24, latMax: 50, lngMin: -85,  lngMax: -60 },
  'NA_WEST':  { id: 'na-west',  name: 'North America West (Oregon)',     latMin: 30, latMax: 60, lngMin: -130, lngMax: -85 },
  'LATAM':    { id: 'latam',    name: 'Latin America (São Paulo / CDMX)', latMin: -55, latMax: 24, lngMin: -120, lngMax: -30 },
  'EU_WEST':  { id: 'eu-west',  name: 'Europe West (Frankfurt/London)',   latMin: 35, latMax: 70, lngMin: -15,  lngMax: 35 },
  'APAC':     { id: 'apac',     name: 'Asia Pacific (Tokyo/Singapore)',   latMin: -45, latMax: 55, lngMin: 60,   lngMax: 150 },
};

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

/**
 * Encodes latitude and longitude into standard Geohash string
 * Precision levels:
 *  - 4 chars: ~39km x 19.5km (Sub-regional shard / Metropolitan area)
 *  - 5 chars: ~4.9km x 4.9km (Local dispatch neighborhood)
 *  - 6 chars: ~1.2km x 0.6km (Hyperlocal telemetry cluster)
 */
export function encodeGeohash(latitude, longitude, precision = 5) {
  let latInterval = [-90.0, 90.0];
  let lonInterval = [-180.0, 180.0];
  let isEven = true;
  let bit = 0;
  let ch = 0;
  let geohash = '';

  while (geohash.length < precision) {
    if (isEven) {
      const mid = (lonInterval[0] + lonInterval[1]) / 2;
      if (longitude > mid) {
        ch |= (1 << (4 - bit));
        lonInterval[0] = mid;
      } else {
        lonInterval[1] = mid;
      }
    } else {
      const mid = (latInterval[0] + latInterval[1]) / 2;
      if (latitude > mid) {
        ch |= (1 << (4 - bit));
        latInterval[0] = mid;
      } else {
        latInterval[1] = mid;
      }
    }

    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }

  return geohash;
}

/**
 * Resolves optimal geographic region shard based on coordinates
 */
export function resolveRegionShard(lat, lng) {
  for (const [key, region] of Object.entries(REGIONS)) {
    if (lat >= region.latMin && lat <= region.latMax && lng >= region.lngMin && lng <= region.lngMax) {
      return region.id;
    }
  }
  return 'na-east'; // Default primary fallback datacenter
}

/**
 * Generates partitioned Redis / WebSocket routing key
 * Example output: "shard:na-east:d8v7"
 */
export function getGeoShardKey(lat, lng, precision = 4) {
  const region = resolveRegionShard(lat, lng);
  const hash = encodeGeohash(lat, lng, precision);
  return `shard:${region}:${hash}`;
}

/**
 * Calculates surrounding adjacent cells for seamless cross-border job dispatch
 */
export function getAdjacentShardKeys(lat, lng, precision = 4) {
  const delta = precision === 4 ? 0.25 : 0.05; // Approximate offset in degrees
  const offsets = [
    [0, 0],       // Center
    [delta, 0],   // North
    [-delta, 0],  // South
    [0, delta],   // East
    [0, -delta],  // West
    [delta, delta],   // NE
    [delta, -delta],  // NW
    [-delta, delta],  // SE
    [-delta, -delta], // SW
  ];

  const keys = new Set();
  for (const [dLat, dLng] of offsets) {
    keys.add(getGeoShardKey(lat + dLat, lng + dLng, precision));
  }
  return Array.from(keys);
}
