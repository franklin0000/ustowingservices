import db from './db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const hash = (pw) => bcrypt.hashSync(pw, 10);

console.log('[PROD_INIT] Verifying production database structure...');

// ── Platform settings ───────────────────────────────────────
const settings = [
  ['platform_name', 'Gruas'],
  ['platform_fee_pct', '20'],
  ['max_search_radius_km', '15'],
  ['currency', 'USD'],
  ['auto_assign', 'true'],
  ['min_driver_rating', '4.0'],
  ['max_active_jobs', '1'],
];

try {
  const insertSetting = db.prepare('INSERT OR IGNORE INTO platform_settings (key, value) VALUES (?, ?)');
  for (const [k, v] of settings) {
    insertSetting.run(k, v);
  }
  console.log('[PROD_INIT] Platform settings verified.');
} catch (error) {
  console.error('[PROD_INIT] Error verifying platform settings:', error.message);
}

// ── Admin User ────────────────────────────────────────────────
try {
  const ADMIN_EMAIL = 'familiafabian@yandex.com';
  const checkAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(ADMIN_EMAIL);
  
  if (!checkAdmin) {
    console.log(`[PROD_INIT] Admin user ${ADMIN_EMAIL} not found. Creating...`);
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password, name, phone, role, status, email_verified, phone_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertUser.run(
      uuid(),
      ADMIN_EMAIL,
      hash('Abrahana02@'),
      'Admin Fabian',
      '1234567890', // placeholder phone
      'admin',
      'active',
      1,
      1
    );
    console.log('[PROD_INIT] Admin user created successfully.');
  } else {
    // Just in case it exists but doesn't have the admin role, let's force the role to 'admin'
    const updateRole = db.prepare("UPDATE users SET role = 'admin' WHERE email = ?");
    updateRole.run(ADMIN_EMAIL);
    console.log(`[PROD_INIT] Admin user ${ADMIN_EMAIL} exists and verified.`);
  }
} catch (error) {
  console.error('[PROD_INIT] Error verifying admin user:', error.message);
}

// ── Mark all users as verified so no one gets blocked ─────────
try {
  db.prepare('UPDATE users SET phone_verified = 1, email_verified = 1').run();
  console.log('[PROD_INIT] All users marked as verified.');
} catch (error) {
  console.error('[PROD_INIT] Error marking users as verified:', error.message);
}

console.log('[PROD_INIT] Database verification complete.');
