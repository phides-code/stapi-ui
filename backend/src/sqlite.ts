import Database from 'better-sqlite3';

export const db = new Database('app.db');

// create table on startup
db.exec(`
    CREATE TABLE IF NOT EXISTS ships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ship_name TEXT NOT NULL,
        registry TEXT NOT NULL,
        ship_class TEXT NOT NULL
    )
`);
