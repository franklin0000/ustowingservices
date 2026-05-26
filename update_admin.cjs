const db = require('better-sqlite3')('server/gruas.db');
const bcrypt = require('bcryptjs');

const oldEmail = 'admin@gruas.com';
const newEmail = 'familiafabian@yandex.com';
const newPassword = 'Abrahana02@';
const hashed = bcrypt.hashSync(newPassword, 10);

const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(oldEmail);
if (existing) {
  db.prepare('UPDATE users SET email = ?, password = ? WHERE email = ?').run(newEmail, hashed, oldEmail);
  console.log('Admin account updated to new credentials.');
} else {
  // If for some reason the old one was deleted, we create it
  const { v4: uuid } = require('uuid');
  const id = uuid();
  db.prepare(
    'INSERT INTO users (id, email, password, name, role, email_verified, phone_verified) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, newEmail, hashed, 'Super Admin', 'admin', 1, 1);
  console.log('Admin account created with new credentials.');
}
