import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "bookings.db");

const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    service TEXT NOT NULL,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_ref TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export const insertBooking = db.prepare(`
  INSERT INTO bookings (id, service, location, date, time, first_name, last_name, phone, email, amount, status)
  VALUES (@id, @service, @location, @date, @time, @firstName, @lastName, @phone, @email, @amount, @status)
`);

export const getBooking = db.prepare(`
  SELECT * FROM bookings WHERE id = ?
`);

export const updateBookingStatus = db.prepare(`
  UPDATE bookings SET status = ?, payment_ref = ?, updated_at = datetime('now') WHERE id = ?
`);

export const listBookings = db.prepare(`
  SELECT * FROM bookings ORDER BY created_at DESC LIMIT 100
`);

export default db;
