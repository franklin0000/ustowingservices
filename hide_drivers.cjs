const Database = require('better-sqlite3');
const db = new Database('./server/gruas.db');
console.log('Drivers:', db.prepare("SELECT user_id, latitude, longitude, available FROM driver_profiles WHERE available = 1").all());
