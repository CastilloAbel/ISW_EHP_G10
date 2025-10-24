import request from 'supertest';
import app from '../server.js';
import { queryOne, queryAll } from '../config/database.js';
import { beforeAll, describe, expect, test } from '@jest/globals';

const ERROR_SIN_CUPO = 'Sin cupo disponible para el horario seleccionado';
const ERROR_HORARIO = 'Horario no disponible';
const ERROR_TYC = 'Debe aceptar términos y condiciones';
const ERROR_TALLE = 'Falta talle de vestimenta';

// Función para generar DNI único
function generarDNI() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

/**
 * Tests de integración para la funcionalidad de inscripción a actividades
 * Estos tests utilizan el backend real y la base de datos SQLite
 */
describe('US: Inscribirme a actividad – Tests de Integración', () => {
  let horarioTirolesa;
  let horarioSafari;
  let horarioPalestra;
  let horarioJardineria;

  beforeAll(async () => {
    // Obtener horarios de prueba para cada actividad
    // Buscamos horarios con cupos disponibles de cada tipo de actividad

    // Tirolesa (requiere talla)
    const horariosTirolesa = await queryAll(`
      SELECT h.* FROM Horarios h
      INNER JOIN Actividades a ON h.id_actividad = a.id
      INNER JOIN TiposActividades t ON a.tipo_id = t.id
      WHERE t.codigo = 'TIROLESA' 
        AND (h.cupos_horario - h.inscriptos_horario) > 0
        AND h.fecha_fin > datetime('now')
      LIMIT 1
    `);
    horarioTirolesa = horariosTirolesa[0];

    // Safari (no requiere talla)
    const horariosSafari = await queryAll(`
      SELECT h.* FROM Horarios h
      INNER JOIN Actividades a ON h.id_actividad = a.id
      INNER JOIN TiposActividades t ON a.tipo_id = t.id
      WHERE t.codigo = 'SAFARI' 
        AND (h.cupos_horario - h.inscriptos_horario) > 0
        AND h.fecha_fin > datetime('now')
      LIMIT 1
    `);
    horarioSafari = horariosSafari[0];

    // Palestra (requiere talla)
    const horariosPalestra = await queryAll(`
      SELECT h.* FROM Horarios h
      INNER JOIN Actividades a ON h.id_actividad = a.id
      INNER JOIN TiposActividades t ON a.tipo_id = t.id
      WHERE t.codigo = 'PALESTRA' 
        AND (h.cupos_horario - h.inscriptos_horario) > 0
        AND h.fecha_fin > datetime('now')
      LIMIT 1
    `);
    horarioPalestra = horariosPalestra[0];

    // Jardinería (no requiere talla)
    const horariosJardineria = await queryAll(`
      SELECT h.* FROM Horarios h
      INNER JOIN Actividades a ON h.id_actividad = a.id
      INNER JOIN TiposActividades t ON a.tipo_id = t.id
      WHERE t.codigo = 'JARDINERIA' 
        AND (h.cupos_horario - h.inscriptos_horario) > 0
        AND h.fecha_fin > datetime('now')
      LIMIT 1
    `);
    horarioJardineria = horariosJardineria[0];
  });

  /**
   * CP1: Probar inscribirse a una actividad del listado que poseen cupos disponibles,
   * seleccionando un horario, ingresando los datos del visitante (nombre, DNI, edad,
   * talla de la vestimenta si la actividad lo requiere) y aceptando los términos y
   * condiciones (pasa)
   */
  test('CP1: Inscripción exitosa con talla (Tirolesa)', async () => {
    if (!horarioTirolesa) {
      console.warn('No hay horarios de Tirolesa disponibles, saltando test');
      return;
    }

    const cuposAntesQuery = await queryOne(
      'SELECT cupos_horario, inscriptos_horario FROM Horarios WHERE id_horario = ?',
      [horarioTirolesa.id_horario]
    );
    const cuposAntes = cuposAntesQuery.cupos_horario - cuposAntesQuery.inscriptos_horario;

    const solicitud = {
      horarioId: horarioTirolesa.id_horario,
      terminosAceptados: true,
      participantes: [
        {
          nombre: 'Camila Test',
          dni: generarDNI(),
          edad: 25,
          talla: 'M'
        }
      ]
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.codigoReserva).toBeDefined();
    expect(response.body.data.cantidadParticipantes).toBe(1);
    expect(response.body.data.inscripcionIds).toHaveLength(1);

    // Verificar que los cupos disminuyeron
    const cuposDespuesQuery = await queryOne(
      'SELECT cupos_horario, inscriptos_horario FROM Horarios WHERE id_horario = ?',
      [horarioTirolesa.id_horario]
    );
    const cuposDespues = cuposDespuesQuery.cupos_horario - cuposDespuesQuery.inscriptos_horario;
    expect(cuposDespues).toBe(cuposAntes - 1);
  });

  /**
   * CP2: Probar inscribirse a una actividad que no tiene cupo para el horario
   * seleccionado (falla)
   */
  test('CP2: Falla cuando no hay cupos disponibles', async () => {
    if (!horarioTirolesa) {
      console.warn('No hay horarios de Tirolesa disponibles, saltando test');
      return;
    }

    // Obtener cupos actuales
    const horarioQuery = await queryOne(
      'SELECT cupos_horario, inscriptos_horario FROM Horarios WHERE id_horario = ?',
      [horarioTirolesa.id_horario]
    );
    const cuposDisponibles = horarioQuery.cupos_horario - horarioQuery.inscriptos_horario;

    // Intentar inscribir más personas de las que hay cupos
    const participantes = [];
    for (let i = 0; i < cuposDisponibles + 1; i++) {
      participantes.push({
        nombre: `Persona ${i}`,
        dni: `1000000${i}`,
        edad: 25,
        talla: 'M'
      });
    }

    const solicitud = {
      horarioId: horarioTirolesa.id_horario,
      terminosAceptados: true,
      participantes
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain(ERROR_SIN_CUPO);
  });

  /**
   * CP3: Probar inscribirse a una actividad sin ingresar talle de vestimenta
   * porque la actividad no lo requiere (pasa)
   */
  test('CP3: Inscripción exitosa sin talla cuando no es requerida (Safari)', async () => {
    if (!horarioSafari) {
      console.warn('No hay horarios de Safari disponibles, saltando test');
      return;
    }

    const solicitud = {
      horarioId: horarioSafari.id_horario,
      terminosAceptados: true,
      participantes: [
        {
          nombre: 'Alex Test',
          dni: generarDNI(),
          edad: 30
          // Sin talla porque Safari no lo requiere
        }
      ]
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.codigoReserva).toBeDefined();
    expect(response.body.data.cantidadParticipantes).toBe(1);
  });

  /**
   * CP4: Probar inscribirse a una actividad seleccionando un horario en el cual
   * el parque está cerrado o la actividad no está disponible (falla)
   */
  test('CP4: Falla con horario no disponible o inexistente', async () => {
    const horarioInexistente = 999999;

    const solicitud = {
      horarioId: horarioInexistente,
      terminosAceptados: true,
      participantes: [
        {
          nombre: 'Test User',
          dni: '11111111',
          edad: 25,
          talla: 'M'
        }
      ]
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain(ERROR_HORARIO);
  });

  /**
   * CP5: Probar inscribirse a una actividad sin aceptar los términos y
   * condiciones de la actividad (falla)
   */
  test('CP5: Falla sin aceptar términos y condiciones', async () => {
    if (!horarioTirolesa) {
      console.warn('No hay horarios de Tirolesa disponibles, saltando test');
      return;
    }

    const solicitud = {
      horarioId: horarioTirolesa.id_horario,
      terminosAceptados: false, // No acepta términos
      participantes: [
        {
          nombre: 'Test User',
          dni: '22222222',
          edad: 25,
          talla: 'M'
        }
      ]
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain(ERROR_TYC);
  });

  /**
   * CP6: Probar inscribirse a una actividad sin ingresar el talle de la
   * vestimenta requerido por la actividad (falla)
   */
  test('CP6: Falla cuando falta talle en actividad que lo requiere (Tirolesa)', async () => {
    if (!horarioTirolesa) {
      console.warn('No hay horarios de Tirolesa disponibles, saltando test');
      return;
    }

    const solicitud = {
      horarioId: horarioTirolesa.id_horario,
      terminosAceptados: true,
      participantes: [
        {
          nombre: 'Test User',
          dni: '33333333',
          edad: 25
          // Falta talla y Tirolesa lo requiere
        }
      ]
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain(ERROR_TALLE);
  });

  /**
   * CP Extra: Inscripción múltiple con varios participantes
   */
  test('CP Extra: Inscripción exitosa con múltiples participantes', async () => {
    if (!horarioSafari) {
      console.warn('No hay horarios de Safari disponibles, saltando test');
      return;
    }

    const cuposAntesQuery = await queryOne(
      'SELECT cupos_horario, inscriptos_horario FROM Horarios WHERE id_horario = ?',
      [horarioSafari.id_horario]
    );
    const cuposAntes = cuposAntesQuery.cupos_horario - cuposAntesQuery.inscriptos_horario;

    const solicitud = {
      horarioId: horarioSafari.id_horario,
      terminosAceptados: true,
      participantes: [
        {
          nombre: 'Participante 1',
          dni: generarDNI(),
          edad: 28
        },
        {
          nombre: 'Participante 2',
          dni: generarDNI(),
          edad: 32
        },
        {
          nombre: 'Participante 3',
          dni: generarDNI(),
          edad: 25
        }
      ]
    };

    const response = await request(app)
      .post('/api/inscripciones')
      .send(solicitud)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.cantidadParticipantes).toBe(3);
    expect(response.body.data.inscripcionIds).toHaveLength(3);

    // Verificar que los cupos disminuyeron en 3
    const cuposDespuesQuery = await queryOne(
      'SELECT cupos_horario, inscriptos_horario FROM Horarios WHERE id_horario = ?',
      [horarioSafari.id_horario]
    );
    const cuposDespues = cuposDespuesQuery.cupos_horario - cuposDespuesQuery.inscriptos_horario;
    expect(cuposDespues).toBe(cuposAntes - 3);
  });
});

