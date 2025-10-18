import { queryAll, queryOne } from '../config/database.js';

/**
 * Repositorio para operaciones de base de datos relacionadas con Actividades
 */
class ActividadesRepository {
  /**
   * Obtiene todas las actividades disponibles
   */
  async findAllActividades() {
    return await queryAll(`
      SELECT DISTINCT nombre, requiere_talla 
      FROM Actividades 
      ORDER BY nombre
    `);
  }

  /**
   * Obtiene los horarios disponibles para una actividad específica
   * @param {string} nombre - Nombre de la actividad
   * @param {string} fechaActual - Fecha actual en formato ISO
   */
  async findHorariosByActividad(nombre, fechaActual) {
    return await queryAll(`
      SELECT 
        id,
        fecha_inicio,
        fecha_fin,
        cupos,
        inscriptos,
        (cupos - inscriptos) as cupos_disponibles
      FROM Actividades
      WHERE UPPER(nombre) = UPPER(?)
        AND fecha_inicio > ?
        AND (cupos - inscriptos) >= 0
      ORDER BY fecha_inicio
    `, [nombre, fechaActual]);
  }

  /**
   * Obtiene un horario específico por ID y nombre de actividad
   * @param {number} id - ID del horario
   * @param {string} nombre - Nombre de la actividad
   */
  async findHorarioById(id, nombre) {
    return await queryOne(`
      SELECT 
        id,
        nombre,
        fecha_inicio,
        fecha_fin,
        cupos,
        inscriptos,
        requiere_talla,
        (cupos - inscriptos) as cupos_disponibles
      FROM Actividades
      WHERE id = ? AND UPPER(nombre) = UPPER(?)
    `, [id, nombre]);
  }

  /**
   * Obtiene un horario por ID
   * @param {number} horarioId - ID del horario
   */
  async findHorarioByIdAndNombre(horarioId, actividad) {
    return await queryOne(`
      SELECT 
        id,
        nombre,
        fecha_inicio,
        fecha_fin,
        cupos,
        inscriptos,
        requiere_talla,
        (cupos - inscriptos) as cupos_disponibles
      FROM Actividades
      WHERE id = ? AND UPPER(nombre) = UPPER(?)
    `, [horarioId, actividad]);
  }

  /**
   * Actualiza el contador de inscriptos
   * @param {Object} db - Conexión a la base de datos
   * @param {number} horarioId - ID del horario
   * @param {number} cantidad - Cantidad a incrementar
   */
  async incrementarInscriptos(db, horarioId, cantidad) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE Actividades SET inscriptos = inscriptos + ? WHERE id = ?`,
        [cantidad, horarioId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}

export default new ActividadesRepository();

