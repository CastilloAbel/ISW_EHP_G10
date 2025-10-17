import express from 'express';
import cors from 'cors';
import { openDb } from './db.js';
import { v4 as uuidv4 } from 'uuid';

const ERROR_SIN_CUPO = 'Sin cupo disponible para el horario seleccionado';
const ERROR_HORARIO  = 'Horario no disponible';
const ERROR_TYC      = 'Debe aceptar términos y condiciones';
const ERROR_TALLE    = 'Falta talle de vestimenta';
const ERROR_PARTIC   = 'Datos de participante inválidos';

export const app = express();
app.use(cors());
app.use(express.json());

function all(db, sql, params=[]) {
  return new Promise((resolve, reject) => db.all(sql, params, (e, rows)=> e?reject(e):resolve(rows)));
}
function get(db, sql, params=[]) {
  return new Promise((resolve, reject) => db.get(sql, params, (e, row)=> e?reject(e):resolve(row)));
}
function run(db, sql, params=[]) {
  return new Promise((resolve, reject) => db.run(sql, params, function(e){ e?reject(e):resolve(this)}));
}

// GET activities
app.get('/api/activities', async (req, res) => {
  const db = openDb();
  const rows = await all(db, `SELECT id, name, requires_size AS requiresSize, terms FROM activities ORDER BY id`);
  db.close();
  res.json(rows);
});

// GET slots by activity
app.get('/api/activities/:id/slots', async (req, res) => {
  const db = openDb();
  const rows = await all(db, `SELECT id, enabled, capacity, remaining, starts_at FROM timeslots WHERE activity_id = ? ORDER BY id`, [req.params.id]);
  db.close();
  res.json(rows);
});

// POST enroll
app.post('/api/enroll', async (req, res) => {
  const { activityId, slotId, participants, termsAccepted } = req.body || {};
  const errors = [];
  const db = openDb();

  try {
    const activity = await get(db, `SELECT id, name, requires_size AS requiresSize FROM activities WHERE id = ?`, [activityId]);
    const slot = await get(db, `SELECT id, enabled, remaining FROM timeslots WHERE activity_id = ? AND id = ?`, [activityId, slotId]);

    if (!slot || !slot.enabled) errors.push(ERROR_HORARIO);

    if (!termsAccepted) errors.push(ERROR_TYC);

    const requiresSize = activity ? !!activity.requiresSize : false;
    if (!Array.isArray(participants) || participants.length === 0) {
      errors.push(ERROR_PARTIC);
    } else {
      for (const p of participants) {
        if (!p?.name || !p?.dni || typeof p?.age !== 'number' || p.age < 0) {
          errors.push(ERROR_PARTIC); break;
        }
        if (requiresSize && !p?.size) {
          errors.push(ERROR_TALLE); break;
        }
      }
    }

    if (errors.length === 0) {
      const needed = participants.length;
      if (!slot || slot.remaining < needed) {
        errors.push(ERROR_SIN_CUPO);
      }
    }

    if (errors.length > 0) {
      db.close();
      return res.json({ ok: false, errors });
    }

    // Reserve
    await run(db, `UPDATE timeslots SET remaining = remaining - ? WHERE activity_id = ? AND id = ?`, [participants.length, activityId, slotId]);
    const code = uuidv4();
    await run(db, `INSERT INTO enrollments(id, activity_id, slot_id) VALUES(?,?,?)`, [code, activityId, slotId]);
    for (const p of participants) {
      await run(db, `INSERT INTO participants(enrollment_id, name, dni, age, size) VALUES(?,?,?,?,?)`, [code, p.name, p.dni, p.age, p.size || null]);
    }
    db.close();
    res.json({ ok: true, code, errors: [] });
  } catch (e) {
    db.close();
    res.status(500).json({ ok: false, errors: ['Server error'], detail: e.message });
  }
});

export const constants = { ERROR_SIN_CUPO, ERROR_HORARIO, ERROR_TYC, ERROR_TALLE, ERROR_PARTIC };
