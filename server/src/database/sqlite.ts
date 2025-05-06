import * as path from 'path';
const Database = require('better-sqlite3');
const db = new Database(path.join(process.cwd(), 'src', 'database', 'users.db'));
// Create or migrate the `users` table
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    access_token TEXT,
    refresh_token TEXT,
    token_type TEXT,
    scope TEXT,
    refresh_token_expires_in INTEGER,
    expiry_date INTEGER,
    history_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`).run();

export default db;
