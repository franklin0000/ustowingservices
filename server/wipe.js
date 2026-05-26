import db from './db.js';

console.log('Wiping database...');

db.exec(`
  PRAGMA foreign_keys = OFF;
  DELETE FROM system_logs;
  DELETE FROM gps_sessions;
  DELETE FROM chat_messages;
  DELETE FROM subscriptions;
  DELETE FROM notifications;
  DELETE FROM payments;
  DELETE FROM payouts;
  DELETE FROM payment_methods;
  DELETE FROM jobs;
  DELETE FROM driver_profiles;
  DELETE FROM users;
  DELETE FROM verification_tokens;
  DELETE FROM sms_codes;
  PRAGMA foreign_keys = ON;
`);

console.log('Database wiped successfully!');
process.exit(0);
