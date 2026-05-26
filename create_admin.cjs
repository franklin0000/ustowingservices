const db = require('better-sqlite3')('server/gruas.db');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

const email = 'admin@gruas.com';
const password = 'admin';
const hashed = bcrypt.hashSync(password, 10);
const id = uuid();

const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
if (existing) {
  db.prepare('UPDATE users SET role = "admin", password = ? WHERE email = ?').run(hashed, email);
  console.log('Admin account updated: admin@gruas.com / admin');
} else {
  db.prepare(
    'INSERT INTO users (id, email, password, name, role, email_verified, phone_verified) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, email, hashed, 'Super Admin', 'admin', 1, 1);
  console.log('Admin account created: admin@gruas.com / admin');
}
