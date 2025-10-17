import request from 'supertest';
import { app, constants } from '../src/app.js';
import { openDb } from '../src/db.js';

// helper to reset DB before each test by invoking the reset script programmatically
import { spawnSync } from 'node:child_process';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbScript = path.join(__dirname, '..', 'src', 'db.js');

beforeEach(() => {
  spawnSync('node', [dbScript, '--reset'], { stdio: 'ignore' });
});

test('CP1: éxito con datos válidos', async () => {
  // get activities to fetch proper IDs
  const acts = await request(app).get('/api/activities');
  const tirolesa = acts.body.find(a => a.name === 'TIROLESA');

  const res = await request(app).post('/api/enroll').send({
    activityId: tirolesa.id,
    slotId: 'H1',
    participants: [{ name: 'Cami', dni: '123', age: 20, size: 'M' }],
    termsAccepted: true
  });

  expect(res.body.ok).toBe(true);
  expect(typeof res.body.code).toBe('string');
  // verify capacity decreased
  const slots = await request(app).get(`/api/activities/${tirolesa.id}/slots`);
  const h1 = slots.body.find(s => s.id === 'H1');
  expect(h1.remaining).toBe(4);
});

test('CP2: sin cupo disponible', async () => {
  const acts = await request(app).get('/api/activities');
  const tirolesa = acts.body.find(a => a.name === 'TIROLESA');

  // set remaining to 0
  const db = openDb();
  await new Promise((r, j) => db.run(`UPDATE timeslots SET remaining = 0 WHERE activity_id = ? AND id = 'H1'`, [tirolesa.id], (e)=> e?j(e):r()));
  db.close();

  const res = await request(app).post('/api/enroll').send({
    activityId: tirolesa.id,
    slotId: 'H1',
    participants: [{ name: 'Cami', dni: '123', age: 20, size: 'M' }],
    termsAccepted: true
  });

  expect(res.body.ok).toBe(false);
  expect(res.body.errors).toContain(constants.ERROR_SIN_CUPO);
});

test('CP3: sin talle si la actividad no lo requiere', async () => {
  const acts = await request(app).get('/api/activities');
  const safari = acts.body.find(a => a.name === 'SAFARI');

  const res = await request(app).post('/api/enroll').send({
    activityId: safari.id,
    slotId: 'H2',
    participants: [{ name: 'Alex', dni: '1111', age: 25 }],
    termsAccepted: true
  });

  expect(res.body.ok).toBe(true);
});

test('CP4: horario no disponible', async () => {
  const acts = await request(app).get('/api/activities');
  const palestra = acts.body.find(a => a.name === 'PALESTRA');

  const res = await request(app).post('/api/enroll').send({
    activityId: palestra.id,
    slotId: 'H3', // disabled by seed
    participants: [{ name: 'Cami', dni: '123', age: 20, size: 'S' }],
    termsAccepted: true
  });

  expect(res.body.ok).toBe(false);
  expect(res.body.errors).toContain(constants.ERROR_HORARIO);
});

test('CP5: no acepta términos y condiciones', async () => {
  const acts = await request(app).get('/api/activities');
  const tirolesa = acts.body.find(a => a.name === 'TIROLESA');

  const res = await request(app).post('/api/enroll').send({
    activityId: tirolesa.id,
    slotId: 'H1',
    participants: [{ name: 'Cami', dni: '123', age: 20, size: 'M' }],
    termsAccepted: false
  });

  expect(res.body.ok).toBe(false);
  expect(res.body.errors).toContain(constants.ERROR_TYC);
});

test('CP6: falta talle en actividad que lo requiere', async () => {
  const acts = await request(app).get('/api/activities');
  const tirolesa = acts.body.find(a => a.name === 'TIROLESA');

  const res = await request(app).post('/api/enroll').send({
    activityId: tirolesa.id,
    slotId: 'H1',
    participants: [{ name: 'Cami', dni: '123', age: 20 }], // missing size
    termsAccepted: true
  });

  expect(res.body.ok).toBe(false);
  expect(res.body.errors).toContain(constants.ERROR_TALLE);
});
