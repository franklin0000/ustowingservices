import db from './db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const hash = (pw) => bcrypt.hashSync(pw, 10);

console.log('Seeding database...');

// ── Clear existing data ─────────────────────────────────────
db.exec(`
  DELETE FROM system_logs;
  DELETE FROM gps_sessions;
  DELETE FROM chat_messages;
  DELETE FROM subscriptions;
  DELETE FROM notifications;
  DELETE FROM payments;
  DELETE FROM jobs;
  DELETE FROM driver_profiles;
  DELETE FROM users;
  DELETE FROM platform_settings;
`);

// ── Platform settings ───────────────────────────────────────
const settings = [
  ['platform_name', 'Gruas'],
  ['platform_fee_pct', '25'],
  ['max_search_radius_km', '15'],
  ['currency', 'USD'],
  ['auto_assign', 'true'],
  ['min_driver_rating', '4.0'],
  ['max_active_jobs', '1'],
];
const insertSetting = db.prepare('INSERT INTO platform_settings (key, value) VALUES (?, ?)');
for (const [k, v] of settings) insertSetting.run(k, v);

// ── Users ───────────────────────────────────────────────────
const users = [
  // Clients
  { id: 'c1', email: 'juan@email.com',      password: hash('password'), name: 'Juan Perez',        phone: '+1 555-0201', role: 'client' },
  { id: 'c2', email: 'maria@email.com',     password: hash('password'), name: 'Maria Garcia',      phone: '+1 555-0202', role: 'client' },
  { id: 'c3', email: 'pedro@email.com',     password: hash('password'), name: 'Pedro Rodriguez',   phone: '+1 555-0203', role: 'client' },
  { id: 'c4', email: 'laura@email.com',     password: hash('password'), name: 'Laura Martinez',    phone: '+1 555-0204', role: 'client' },
  { id: 'c5', email: 'roberto@email.com',   password: hash('password'), name: 'Roberto Diaz',      phone: '+1 555-0205', role: 'client' },
  { id: 'c6', email: 'carmen@email.com',    password: hash('password'), name: 'Carmen Flores',     phone: '+1 555-0206', role: 'client' },
  { id: 'c7', email: 'fernando@email.com',  password: hash('password'), name: 'Fernando Lopez',    phone: '+1 555-0207', role: 'client' },
  { id: 'c8', email: 'andrea@email.com',    password: hash('password'), name: 'Andrea Ruiz',       phone: '+1 555-0208', role: 'client' },
  // Drivers
  { id: 'd1', email: 'carlos@email.com',    password: hash('password'), name: 'Carlos Rivera',     phone: '+1 555-0101', role: 'driver' },
  { id: 'd2', email: 'miguel@email.com',    password: hash('password'), name: 'Miguel Torres',     phone: '+1 555-0102', role: 'driver' },
  { id: 'd3', email: 'ana@email.com',       password: hash('password'), name: 'Ana Gutierrez',     phone: '+1 555-0103', role: 'driver' },
  { id: 'd4', email: 'robertom@email.com',  password: hash('password'), name: 'Roberto Mendez',    phone: '+1 555-0104', role: 'driver' },
  { id: 'd5', email: 'sofia@email.com',     password: hash('password'), name: 'Sofia Hernandez',   phone: '+1 555-0105', role: 'driver' },
  { id: 'd6', email: 'luis@email.com',      password: hash('password'), name: 'Luis Morales',      phone: '+1 555-0106', role: 'driver' },
  // Admins
  { id: 'a1', email: 'fammiliafabian@yandex.com',     password: hash('Abrahana0211@'), name: 'Admin User',        phone: '+1 555-0001', role: 'admin' },
];

const insertUser = db.prepare(
  'INSERT INTO users (id, email, password, name, phone, role) VALUES (@id, @email, @password, @name, @phone, @role)'
);
for (const u of users) insertUser.run(u);

// ── Driver profiles ─────────────────────────────────────────
const drivers = [
  { user_id: 'd1', vehicle: 'Ford F-450 Tow Truck',    license_plate: 'TOW-101', latitude: 19.4326, longitude: -99.1332, available: 1, rating: 4.9, total_ratings: 342, completed_jobs: 342, total_earnings: 12450, kyc_status: 'approved' },
  { user_id: 'd2', vehicle: 'Chevrolet Silverado 3500', license_plate: 'TOW-102', latitude: 19.4150, longitude: -99.1500, available: 1, rating: 4.7, total_ratings: 218, completed_jobs: 218, total_earnings: 8920, kyc_status: 'approved' },
  { user_id: 'd3', vehicle: 'Ram 5500 Flatbed',         license_plate: 'TOW-103', latitude: 19.4400, longitude: -99.1200, available: 0, rating: 4.8, total_ratings: 156, completed_jobs: 156, total_earnings: 6780, kyc_status: 'approved' },
  { user_id: 'd4', vehicle: 'International MV Tow',     license_plate: 'TOW-104', latitude: 19.4250, longitude: -99.1650, available: 1, rating: 4.6, total_ratings: 489, completed_jobs: 489, total_earnings: 18340, kyc_status: 'approved' },
  { user_id: 'd5', vehicle: 'Freightliner M2 106',      license_plate: 'TOW-105', latitude: 19.4500, longitude: -99.1100, available: 1, rating: 4.9, total_ratings: 273, completed_jobs: 273, total_earnings: 10230, kyc_status: 'approved' },
  { user_id: 'd6', vehicle: 'Ford F-550 Super Duty',    license_plate: 'TOW-106', latitude: 19.4180, longitude: -99.1780, available: 0, rating: 4.5, total_ratings: 167, completed_jobs: 167, total_earnings: 7120, kyc_status: 'approved' },
];

const insertDriver = db.prepare(
  `INSERT INTO driver_profiles (user_id, vehicle, license_plate, latitude, longitude, available, rating, total_ratings, completed_jobs, total_earnings, kyc_status)
   VALUES (@user_id, @vehicle, @license_plate, @latitude, @longitude, @available, @rating, @total_ratings, @completed_jobs, @total_earnings, @kyc_status)`
);
for (const d of drivers) insertDriver.run(d);

// ── Historical jobs ─────────────────────────────────────────
const jobs = [
  { id: 'j1', client_id: 'c1', driver_id: 'd1', service_type: 'tow',       vehicle_type: 'sedan',      vehicle_details: '2020 Toyota Camry - Silver',   pickup_location: 'Av. Reforma 222, CDMX',   pickup_lat: 19.4284, pickup_lng: -99.1676, destination: 'Taller Mecanico Central', dest_lat: 19.44, dest_lng: -99.15, status: 'completed', amount: 95,  rating: 5, created_at: '2026-05-21 08:30:00', completed_at: '2026-05-21 09:45:00' },
  { id: 'j2', client_id: 'c2', driver_id: 'd2', service_type: 'jumpstart',  vehicle_type: 'suv',        vehicle_details: '2022 Honda CR-V - Black',      pickup_location: 'Polanco, Miguel Hidalgo',  pickup_lat: 19.4330, pickup_lng: -99.1910, destination: null,                      dest_lat: null,  dest_lng: null,   status: 'completed', amount: 50,  rating: 4, created_at: '2026-05-21 10:15:00', completed_at: '2026-05-21 10:50:00' },
  { id: 'j3', client_id: 'c3', driver_id: 'd4', service_type: 'tire',       vehicle_type: 'sedan',      vehicle_details: '2019 Nissan Sentra - White',   pickup_location: 'Condesa, Cuauhtemoc',      pickup_lat: 19.4120, pickup_lng: -99.1730, destination: null,                      dest_lat: null,  dest_lng: null,   status: 'in_service', amount: 60, rating: null, created_at: '2026-05-21 14:20:00', completed_at: null },
  { id: 'j4', client_id: 'c4', driver_id: null,  service_type: 'fuel',       vehicle_type: 'van',        vehicle_details: '2021 Ford Transit - Blue',     pickup_location: 'Roma Norte, Cuauhtemoc',   pickup_lat: 19.4190, pickup_lng: -99.1610, destination: null,                      dest_lat: null,  dest_lng: null,   status: 'pending',    amount: 45,  rating: null, created_at: '2026-05-21 15:00:00', completed_at: null },
  { id: 'j5', client_id: 'c5', driver_id: null,  service_type: 'tow',        vehicle_type: 'heavy',      vehicle_details: '2018 Ford F-150 - Red',        pickup_location: 'Santa Fe, Alvaro Obregon', pickup_lat: 19.3660, pickup_lng: -99.2620, destination: 'AutoZone Periferico',     dest_lat: 19.38, dest_lng: -99.19, status: 'pending',    amount: 120, rating: null, created_at: '2026-05-21 15:10:00', completed_at: null },
  { id: 'j6', client_id: 'c6', driver_id: 'd5', service_type: 'lockout',    vehicle_type: 'sedan',      vehicle_details: '2023 Mazda 3 - Gray',          pickup_location: 'Coyoacan Centro',          pickup_lat: 19.3500, pickup_lng: -99.1620, destination: null,                      dest_lat: null,  dest_lng: null,   status: 'completed',  amount: 55,  rating: 5, created_at: '2026-05-20 11:30:00', completed_at: '2026-05-20 12:00:00' },
  { id: 'j7', client_id: 'c7', driver_id: 'd1', service_type: 'tow',        vehicle_type: 'motorcycle', vehicle_details: '2021 Honda CBR600 - Red',      pickup_location: 'Insurgentes Sur 1200',     pickup_lat: 19.3900, pickup_lng: -99.1780, destination: 'Moto Taller Express',    dest_lat: 19.40, dest_lng: -99.16, status: 'completed',  amount: 75,  rating: 4, created_at: '2026-05-20 16:00:00', completed_at: '2026-05-20 17:10:00' },
  { id: 'j8', client_id: 'c8', driver_id: 'd2', service_type: 'jumpstart',  vehicle_type: 'sedan',      vehicle_details: '2020 VW Jetta - Black',        pickup_location: 'Narvarte Poniente',        pickup_lat: 19.3980, pickup_lng: -99.1560, destination: null,                      dest_lat: null,  dest_lng: null,   status: 'completed',  amount: 48,  rating: 5, created_at: '2026-05-19 09:00:00', completed_at: '2026-05-19 09:30:00' },
];

const insertJob = db.prepare(
  `INSERT INTO jobs (id, client_id, driver_id, service_type, vehicle_type, vehicle_details,
    pickup_location, pickup_lat, pickup_lng, destination, dest_lat, dest_lng,
    status, amount, rating, created_at, completed_at)
   VALUES (@id, @client_id, @driver_id, @service_type, @vehicle_type, @vehicle_details,
    @pickup_location, @pickup_lat, @pickup_lng, @destination, @dest_lat, @dest_lng,
    @status, @amount, @rating, @created_at, @completed_at)`
);
for (const j of jobs) insertJob.run(j);

// ── Payments for completed jobs ─────────────────────────────
const completedJobs = jobs.filter(j => j.status === 'completed');
const insertPayment = db.prepare(
  `INSERT INTO payments (id, job_id, client_id, driver_id, amount, platform_fee, driver_payout, status, created_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?)`
);
for (const j of completedJobs) {
  const fee = j.amount * 0.25;
  insertPayment.run(
    `pay_${j.id}`, j.id, j.client_id, j.driver_id,
    j.amount, fee, j.amount - fee, j.completed_at
  );
}

// ── Seed notifications ──────────────────────────────────────
const insertNotif = db.prepare(
  `INSERT INTO notifications (id, user_id, type, title, message, read, created_at)
   VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
);
insertNotif.run(uuid(), 'd1', 'job',     'New Service Request',  'Laura Martinez needs fuel delivery in Roma Norte', 0);
insertNotif.run(uuid(), 'd1', 'payment', 'Payment Received',     '$95.00 received for tow service - Juan Perez',    0);
insertNotif.run(uuid(), 'a1', 'system',  'Driver Approved',      'Sofia Hernandez has been approved as a driver',    1);
insertNotif.run(uuid(), 'd5', 'rating',  'New Rating',           'Carmen Flores rated the service 5 stars',          1);

console.log('Database seeded successfully!');
console.log(`  Users:    ${db.prepare('SELECT COUNT(*) as c FROM users').get().c}`);
console.log(`  Drivers:  ${db.prepare('SELECT COUNT(*) as c FROM driver_profiles').get().c}`);
console.log(`  Jobs:     ${db.prepare('SELECT COUNT(*) as c FROM jobs').get().c}`);
console.log(`  Payments: ${db.prepare('SELECT COUNT(*) as c FROM payments').get().c}`);

process.exit(0);
