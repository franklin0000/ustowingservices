const db = require('better-sqlite3')('server/gruas.db');
db.prepare("UPDATE platform_settings SET value = '20' WHERE key = 'platform_fee_pct'").run();
console.log("Updated to 20%");
