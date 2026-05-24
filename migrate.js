import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'server', 'gruas.db'));

db.exec(`
PRAGMA foreign_keys=off;
BEGIN TRANSACTION;
CREATE TABLE new_jobs (
    id                TEXT PRIMARY KEY,
    client_id         TEXT NOT NULL REFERENCES users(id),
    driver_id         TEXT REFERENCES users(id),
    service_type      TEXT NOT NULL,
    vehicle_type      TEXT NOT NULL,
    vehicle_details   TEXT,
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
INSERT INTO new_jobs (id, client_id, driver_id, service_type, vehicle_type, vehicle_details, pickup_location, pickup_lat, pickup_lng, destination, dest_lat, dest_lng, status, amount, notes, rating, review, created_at, updated_at, completed_at)
SELECT id, client_id, driver_id, service_type, vehicle_type, vehicle_details, pickup_location, pickup_lat, pickup_lng, destination, dest_lat, dest_lng, status, amount, notes, rating, review, created_at, updated_at, completed_at FROM jobs;
DROP TABLE jobs;
ALTER TABLE new_jobs RENAME TO jobs;
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
COMMIT;
PRAGMA foreign_keys=on;
`);

console.log("Migration successful");
