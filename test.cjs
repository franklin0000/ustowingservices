const http = require('http');
const db = require('better-sqlite3')('server/gruas.db');
const client = db.prepare('SELECT id FROM users WHERE role="client" LIMIT 1').get();

// Create a dummy token for testing (this requires signing, actually let me just bypass authenticate in the test script by signing a token)
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });
const token = jwt.sign({ id: client.id, role: 'client' }, process.env.JWT_SECRET || 'fallback_secret');

http.get('http://localhost:3001/api/drivers/99df741a-2495-4dad-9718-cbab7d71baf5/public-profile', {
  headers: { 'Authorization': `Bearer ${token}` }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(res.statusCode, data));
});
