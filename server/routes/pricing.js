import { Router } from 'express';
import db from '../db.js';
import { haversine } from '../services/geo.js';

const router = Router();

// Reverse Geocode helper (for debugging/internal use)
router.get('/geocode', async (req, res) => {
  const { q } = req.query;
  try {
    const MAPBOX_TOKEN = 'pk.eyJ1IjoidXN0b3dpbmciLCJhIjoiY21waGl5OWcwMGduaDJxcHhoYXI0djVzNyJ9.UbE-OghawPl0CCNYxpbriA';
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${MAPBOX_TOKEN}&country=us,mx,ca`);
    if (!response.ok) {
      throw new Error(`Mapbox error: ${response.status}`);
    }
    const data = await response.json();
    if (!data.features || data.features.length === 0) {
      return res.json([]);
    }
    // Map Mapbox response to the old Nominatim format for frontend compatibility
    const mapped = data.features.map(f => ({
      lat: f.center[1],
      lon: f.center[0],
      display_name: f.place_name
    }));
    res.json(mapped);
  } catch (err) {
    console.error('Geocoding error:', err.message);
    res.json([]);
  }
});

// GET /api/pricing/quote
router.get('/quote', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  const { pickupLat, pickupLng, destLat, destLng, vehicleType = 'Sedan' } = req.query;

  if (!pickupLat || !pickupLng || !destLat || !destLng) {
    return res.status(400).json({ error: 'Pickup and destination coordinates are required' });
  }

  const pLat = parseFloat(pickupLat);
  const pLng = parseFloat(pickupLng);
  const dLat = parseFloat(destLat);
  const dLng = parseFloat(destLng);

  let stateName = 'default';
  let countryCode = 'us'; // Default to US

  // 1. Perform Reverse Geocoding to get the state using Mapbox
  try {
    const MAPBOX_TOKEN = 'pk.eyJ1IjoidXN0b3dpbmciLCJhIjoiY21waGl5OWcwMGduaDJxcHhoYXI0djVzNyJ9.UbE-OghawPl0CCNYxpbriA';
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${pLng},${pLat}.json?access_token=${MAPBOX_TOKEN}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.features && data.features.length > 0) {
        const feature = data.features[0];
        const context = feature.context || [];
        const regionObj = context.find(c => c.id.startsWith('region'));
        const countryObj = context.find(c => c.id.startsWith('country'));
        
        if (regionObj) stateName = regionObj.text;
        if (countryObj && countryObj.short_code) countryCode = countryObj.short_code.toLowerCase();
      }
    }
  } catch (error) {
    console.warn('Geocoding failed, using default pricing:', error.message);
  }

  // 2. Lookup Pricing from DB
  let pricing = db.prepare('SELECT * FROM country_vehicle_pricing WHERE country_code = ? AND LOWER(vehicle_type) = LOWER(?)').get(countryCode, vehicleType);
  
  if (!pricing) {
    // Fallback to 'us' if country not found but we have the vehicle type
    pricing = db.prepare('SELECT * FROM country_vehicle_pricing WHERE country_code = ? AND LOWER(vehicle_type) = LOWER(?)').get('us', vehicleType);
  }

  if (!pricing) {
    // Ultimate fallback if vehicle type somehow doesn't match
    pricing = { base_rate: 75.0, per_km_rate: 4.0, currency: 'USD' };
  }

  // 3. Calculate distance
  // haversine returns distance in kilometers
  const distance = haversine(pLat, pLng, dLat, dLng);
  
  // 4. Calculate total
  const baseRate = pricing.base_rate;
  const perKmRate = pricing.per_km_rate;
  
  // Math.round to 2 decimals for total
  const total = Math.round((baseRate + (distance * perKmRate)) * 100) / 100;

  res.json({
    state: stateName,
    countryCode,
    baseRate,
    perKmRate,
    vehicleType,
    distance: Math.round(distance * 10) / 10, // round distance to 1 decimal
    total,
    currency: pricing.currency
  });
});

export default router;
