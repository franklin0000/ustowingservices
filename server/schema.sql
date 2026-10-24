-- Cloudflare D1 Database Schema for US Towing Services
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password      TEXT,
  google_id     TEXT UNIQUE,
  name          TEXT NOT NULL,
  phone         TEXT,
  phone_verified INTEGER DEFAULT 0,
  role          TEXT NOT NULL CHECK(role IN ('client','driver','admin')),
  status        TEXT DEFAULT 'active' CHECK(status IN ('active','suspended')),
  avatar        TEXT,
  stripe_customer_id TEXT,
  email_verified INTEGER DEFAULT 0,
  created_at    TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS driver_profiles (
  user_id         TEXT PRIMARY KEY REFERENCES users(id),
  vehicle         TEXT NOT NULL,
  license_plate   TEXT,
  kyc_status      TEXT DEFAULT 'pending' CHECK(kyc_status IN ('pending','approved','rejected')),
  id_document     TEXT,
  insurance_doc   TEXT,
  latitude        REAL DEFAULT 25.7617,
  longitude       REAL DEFAULT -80.1918,
  available       INTEGER DEFAULT 0,
  rating          REAL DEFAULT 5.0,
  total_ratings   INTEGER DEFAULT 0,
  completed_jobs  INTEGER DEFAULT 0,
  total_earnings  REAL DEFAULT 0.0,
  stripe_account_id TEXT,
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS jobs (
  id                TEXT PRIMARY KEY,
  client_id         TEXT NOT NULL REFERENCES users(id),
  driver_id         TEXT REFERENCES users(id),
  service_type      TEXT NOT NULL,
  vehicle_type      TEXT NOT NULL,
  vehicle_details   TEXT,
  photos            TEXT,
  pickup_location   TEXT NOT NULL,
  pickup_lat        REAL NOT NULL,
  pickup_lng        REAL NOT NULL,
  destination       TEXT,
  dest_lat          REAL,
  dest_lng          REAL,
  status            TEXT DEFAULT 'pending'
                      CHECK(status IN ('pending','matched','accepted','negotiating','en_route',
                                       'arrived','in_service','completed','cancelled')),
  amount            REAL NOT NULL,
  agreed_price      REAL,
  notes             TEXT,
  rating            INTEGER,
  review            TEXT,
  created_at        TEXT DEFAULT (datetime('now')),
  updated_at        TEXT DEFAULT (datetime('now')),
  completed_at      TEXT
);

CREATE TABLE IF NOT EXISTS payments (
  id              TEXT PRIMARY KEY,
  job_id          TEXT NOT NULL REFERENCES jobs(id),
  client_id       TEXT NOT NULL REFERENCES users(id),
  driver_id       TEXT REFERENCES users(id),
  amount          REAL NOT NULL,
  platform_fee    REAL NOT NULL,
  driver_payout   REAL NOT NULL,
  method          TEXT DEFAULT 'credit_card',
  card_last4      TEXT DEFAULT '4521',
  status          TEXT DEFAULT 'pending' CHECK(status IN ('pending','completed','refunded')),
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notifications (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id),
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  read        INTEGER DEFAULT 0,
  data        TEXT,
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS platform_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed Initial Super Admin and Drivers
INSERT OR IGNORE INTO users (id, email, password, name, phone, role, status, email_verified, phone_verified)
VALUES 
  ('bc397bee-7d4e-4a9a-bf75-b04c16ffa854', 'familiafabian@yandex.com', '$2a$10$caO16E0GeykGqXZ8DQ6Vf.zREHFuyUG3RFC3SaJ7nIa/ocgsddhw.', 'Super Admin', '+1 800-555-0199', 'admin', 'active', 1, 1),
  ('99df741a-2495-4dad-9718-cbab7d71baf5', 'ustowingservices@ustowingservices.com', '$2a$10$SpUzqaxGBxQmZnjk4/k1iuqC15Zl4zErxN8XNklepUizp2Yn51H.W', 'Frank Familia', '+1 800-555-0100', 'driver', 'active', 1, 1),
  ('328b395e-cb35-42b8-949e-c38ee6115e58', 'familiababyapple@gmail.com', '$2a$10$caO16E0GeykGqXZ8DQ6Vf.zREHFuyUG3RFC3SaJ7nIa/ocgsddhw.', 'Fran FF', '+1 800-555-0101', 'driver', 'active', 1, 1);

INSERT OR IGNORE INTO driver_profiles (user_id, vehicle, license_plate, available, kyc_status, rating, completed_jobs, total_earnings)
VALUES 
  ('99df741a-2495-4dad-9718-cbab7d71baf5', 'Flatbed Tow Truck (Heavy Duty)', 'TOW-777', 1, 'approved', 5.0, 148, 12450),
  ('328b395e-cb35-42b8-949e-c38ee6115e58', 'Wheel-Lift Tow Truck', 'TOW-888', 1, 'approved', 4.9, 94, 7800);
