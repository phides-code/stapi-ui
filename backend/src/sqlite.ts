import Database from 'better-sqlite3';
import { formatLocalTimestamp } from './utils/time';

export const db = new Database('app.db');
console.log(`[${formatLocalTimestamp()}] Connected to SQLite database: app.db`);

// create table on startup
db.exec(`
    CREATE TABLE IF NOT EXISTS ships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ship_name TEXT NOT NULL,
        registry TEXT NOT NULL,
        ship_class TEXT NOT NULL
    )
`);
console.log(`[${formatLocalTimestamp()}] Ensured ships table exists`);
