import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'EHP_database.db');

export function openDb() {
  const db = new sqlite3.Database(DB_PATH);
  return db;
}

function run(db, sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err); else resolve(this);
    });
  });
}
function all(db, sql, params=[]) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function(err, rows) {
      if (err) reject(err); else resolve(rows);
    });
  });
}

async function reset() {
  const db = openDb();
  await run(db, `PRAGMA foreign_keys = OFF;`);
  await run(db, `DROP TABLE IF EXISTS enrollments;`);
  await run(db, `DROP TABLE IF EXISTS participants;`);
  await run(db, `DROP TABLE IF EXISTS timeslots;`);
  await run(db, `DROP TABLE IF EXISTS activities;`);
  await run(db, `CREATE TABLE activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    requires_size INTEGER NOT NULL DEFAULT 0,
    terms TEXT DEFAULT ''
  );`);
  await run(db, `CREATE TABLE timeslots (
    id TEXT NOT NULL,
    activity_id INTEGER NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    capacity INTEGER NOT NULL,
    remaining INTEGER NOT NULL,
    starts_at TEXT DEFAULT NULL,
    PRIMARY KEY (id, activity_id),
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
  );`);
  await run(db, `CREATE TABLE enrollments (
    id TEXT PRIMARY KEY,
    activity_id INTEGER NOT NULL,
    slot_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id, slot_id) REFERENCES timeslots(activity_id, id) ON DELETE RESTRICT
  );`);
  await run(db, `CREATE TABLE participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enrollment_id TEXT NOT NULL,
    name TEXT NOT NULL,
    dni TEXT NOT NULL,
    age INTEGER NOT NULL,
    size TEXT,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
  );`);

  // Seed
  const acts = [
    { name: 'TIROLESA', requires_size: 1 },
    { name: 'SAFARI', requires_size: 0 },
    { name: 'PALESTRA', requires_size: 1 },
    { name: 'JARDINERIA', requires_size: 0 }
  ];
  for (const a of acts) {
    await run(db, `INSERT INTO activities(name, requires_size, terms) VALUES(?,?,?)`, [a.name, a.requires_size, `Términos para ${a.name}`]);
  }
  const activityRows = await all(db, `SELECT * FROM activities`);
  const idByName = Object.fromEntries(activityRows.map(r => [r.name, r.id]));
  const slots = [
    { id: 'H1', activity: 'TIROLESA', enabled: 1, capacity: 5, remaining: 5 },
    { id: 'H2', activity: 'SAFARI',   enabled: 1, capacity: 10, remaining: 10 },
    { id: 'H3', activity: 'PALESTRA', enabled: 0, capacity: 8, remaining: 8 }
  ];
  for (const s of slots) {
    await run(db, `INSERT INTO timeslots(id, activity_id, enabled, capacity, remaining) VALUES(?,?,?,?,?)`,
      [s.id, idByName[s.activity], s.enabled, s.capacity, s.remaining]);
  }
  db.close();
}

if (process.argv.includes('--reset')) {
  reset().then(() => {
    console.log('DB reset and seeded at', DB_PATH);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
