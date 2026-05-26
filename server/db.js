import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'gruas.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ──────────────────────────────────────────────────
db.exec(`
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

  CREATE TABLE IF NOT EXISTS sms_codes (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       TEXT NOT NULL REFERENCES users(id),
    phone         TEXT NOT NULL,
    code          TEXT NOT NULL,
    expires_at    TEXT NOT NULL,
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS driver_profiles (
    user_id         TEXT PRIMARY KEY REFERENCES users(id),
    vehicle         TEXT NOT NULL,
    license_plate   TEXT,
    kyc_status      TEXT DEFAULT 'pending' CHECK(kyc_status IN ('pending','approved','rejected')),
    id_document     TEXT,
    insurance_doc   TEXT,
    latitude        REAL DEFAULT 19.4326,
    longitude       REAL DEFAULT -99.1332,
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

  CREATE TABLE IF NOT EXISTS payouts (
    id              TEXT PRIMARY KEY,
    driver_id       TEXT NOT NULL REFERENCES users(id),
    amount          REAL NOT NULL,
    status          TEXT DEFAULT 'pending' CHECK(status IN ('pending','processing','completed','failed')),
    stripe_transfer_id TEXT,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS payment_methods (
    id              TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL REFERENCES users(id),
    type            TEXT NOT NULL,
    provider        TEXT NOT NULL,
    last4           TEXT NOT NULL,
    expiry          TEXT NOT NULL,
    is_default      INTEGER DEFAULT 0,
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

  CREATE TABLE IF NOT EXISTS subscriptions (
    id            TEXT PRIMARY KEY,
    driver_id     TEXT NOT NULL REFERENCES users(id),
    plan_type     TEXT NOT NULL CHECK(plan_type IN ('daily','monthly')),
    status        TEXT DEFAULT 'active' CHECK(status IN ('active','cancelled','expired')),
    amount        REAL NOT NULL,
    starts_at     TEXT DEFAULT (datetime('now')),
    expires_at    TEXT NOT NULL,
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id            TEXT PRIMARY KEY,
    job_id        TEXT NOT NULL REFERENCES jobs(id),
    sender_id     TEXT NOT NULL REFERENCES users(id),
    receiver_id   TEXT NOT NULL REFERENCES users(id),
    message       TEXT NOT NULL,
    read          INTEGER DEFAULT 0,
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gps_sessions (
    id            TEXT PRIMARY KEY,
    job_id        TEXT NOT NULL REFERENCES jobs(id),
    driver_id     TEXT NOT NULL REFERENCES users(id),
    route_data    TEXT NOT NULL, -- JSON array of coordinates
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS system_logs (
    id            TEXT PRIMARY KEY,
    level         TEXT DEFAULT 'info' CHECK(level IN ('info','warning','error','critical')),
    category      TEXT NOT NULL, -- 'payment', 'auth', 'system', 'job'
    message       TEXT NOT NULL,
    details       TEXT, -- JSON string
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS verification_tokens (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL REFERENCES users(id),
    token         TEXT NOT NULL UNIQUE,
    expires_at    TEXT NOT NULL,
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS region_pricing (
    state         TEXT PRIMARY KEY,
    base_rate     REAL NOT NULL,
    per_km_rate   REAL NOT NULL,
    currency      TEXT NOT NULL DEFAULT 'USD'
  );

  CREATE TABLE IF NOT EXISTS country_vehicle_pricing (
    country_code  TEXT NOT NULL,
    vehicle_type  TEXT NOT NULL,
    base_rate     REAL NOT NULL,
    per_km_rate   REAL NOT NULL,
    currency      TEXT NOT NULL DEFAULT 'USD',
    PRIMARY KEY (country_code, vehicle_type)
  );

  INSERT OR IGNORE INTO country_vehicle_pricing (country_code, vehicle_type, base_rate, per_km_rate, currency) VALUES 
    ('us', 'Sedan', 75.0, 4.0, 'USD'),
    ('us', 'Motorcycle', 60.0, 3.5, 'USD'),
    ('us', 'SUV', 100.0, 4.5, 'USD'),
    ('us', 'Van', 100.0, 4.5, 'USD'),
    ('us', 'Heavy', 200.0, 6.0, 'USD'),
    ('ca', 'Sedan', 75.0, 4.0, 'CAD'),
    ('ca', 'Motorcycle', 60.0, 3.5, 'CAD'),
    ('ca', 'SUV', 100.0, 4.5, 'CAD'),
    ('ca', 'Van', 100.0, 4.5, 'CAD'),
    ('ca', 'Heavy', 250.0, 6.0, 'CAD');

  CREATE TABLE IF NOT EXISTS vehicle_pricing (
    vehicle_type  TEXT PRIMARY KEY,
    multiplier    REAL NOT NULL
  );

  INSERT OR IGNORE INTO region_pricing (state, base_rate, per_km_rate, currency) VALUES 
    ('default', 50.0, 2.5, 'USD'),
    ('Ciudad de México', 500.0, 25.0, 'MXN'),
    ('Estado de México', 600.0, 22.0, 'MXN'),
    ('Jalisco', 550.0, 20.0, 'MXN'),
    ('Nuevo León', 600.0, 24.0, 'MXN'),
    ('California', 75.0, 4.0, 'USD'),
    ('Texas', 65.0, 3.5, 'USD'),
    ('Florida', 70.0, 3.8, 'USD'),
    ('New York', 85.0, 5.0, 'USD');

  INSERT OR IGNORE INTO vehicle_pricing (vehicle_type, multiplier) VALUES 
    ('Sedan', 1.0),
    ('Motorcycle', 0.8),
    ('SUV', 1.2),
    ('Van', 1.3),
    ('Heavy', 2.5);

  CREATE INDEX IF NOT EXISTS idx_jobs_client   ON jobs(client_id);
  CREATE INDEX IF NOT EXISTS idx_jobs_driver   ON jobs(driver_id);
  CREATE INDEX IF NOT EXISTS idx_jobs_status   ON jobs(status);
  CREATE INDEX IF NOT EXISTS idx_payments_job  ON payments(job_id);
  CREATE INDEX IF NOT EXISTS idx_pay_methods   ON payment_methods(user_id);
  CREATE INDEX IF NOT EXISTS idx_notif_user    ON notifications(user_id);
  CREATE INDEX IF NOT EXISTS idx_driver_avail  ON driver_profiles(available);
  CREATE INDEX IF NOT EXISTS idx_verif_token   ON verification_tokens(token);
`);

// Apply migrations dynamically if adding new columns to existing tables
try {
  db.exec('ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0');
} catch (e) {
  // Ignore
}
try {
  db.exec('ALTER TABLE users ADD COLUMN avatar TEXT');
} catch (e) {
  // Ignore
}

export default db;
