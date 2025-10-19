import { queryAll, queryOne } from '../config/database.js';

/**
 * Repositorio para operaciones de base de datos relacionadas con Actividades
 */
class ActividadesRepository {
  /**
   * Obtiene todos los tipos de actividades
   */
  async findAllTiposActividades() {
    return await queryAll(`
      SELECT id, codigo, nombre, descripcion
      FROM TiposActividades 
      ORDER BY nombre
    `);
  }

  /**
   * Obtiene todas las actividades disponibles
   * @param {number} tipoId - ID del tipo de actividad (opcional)
   */
  async findAllActividades(tipoId = null) {
    let query = `
      SELECT 
        a.id,
        a.nombre,
        a.descripcion,
        a.requiere_talla,
        a.cupos,
        t.id as tipo_id,
        t.nombre as tipo_nombre,
        t.codigo as tipo_codigo
      FROM Actividades a
      INNER JOIN TiposActividades t ON a.tipo_id = t.id
      WHERE 1=1
    `;
    const params = [];
    if (tipoId) {
      query += ` AND a.tipo_id = ?`;
      params.push(tipoId);
    }
    query += ` ORDER BY a.nombre`;
    console.log(query);
    return await queryAll(query, params);
  }

  /**
   * Obtiene una actividad por ID
   * @param {number} actividadId - ID de la actividad
   */
  async findActividadById(actividadId) {
    return await queryOne(`
      SELECT 
        a.id,
        a.nombre,
        a.descripcion,
        a.requiere_talla,
        a.cupos,
        t.id as tipo_id,
        t.nombre as tipo_nombre,
        t.codigo as tipo_codigo
      FROM Actividades a
      INNER JOIN TiposActividades t ON a.tipo_id = t.id
      WHERE a.id = ?
    `, [actividadId]);
  }

  /**
   * Obtiene los horarios disponibles para una actividad específica
   * @param {number} actividadId - ID de la actividad
   * @param {string} fechaActual - Fecha actual en formato ISO
   */
  async findHorariosByActividad(actividadId, fechaActual) {
    return await queryAll(`
      SELECT 
        h.id_horario,
        h.fecha_inicio,
        h.fecha_fin,
        h.cuidador_nombre,
        h.cupos_horario,
        h.inscriptos_horario,
        (h.cupos_horario - h.inscriptos_horario) as cupos_disponibles,
        a.nombre as actividad_nombre,
        a.requiere_talla
      FROM Horarios h
      INNER JOIN Actividades a ON h.id_actividad = a.id
      WHERE h.id_actividad = ?
        AND h.fecha_fin > ?
        AND (h.cupos_horario - h.inscriptos_horario) > 0
      ORDER BY h.fecha_inicio
    `, [actividadId, fechaActual]);
  }

  /**
   * Obtiene un horario específico por ID
   * @param {number} horarioId - ID del horario
   */
  async findHorarioById(horarioId) {
    return await queryOne(`
      SELECT 
        h.id_horario,
        h.id_actividad,
        h.fecha_inicio,
        h.fecha_fin,
        h.cuidador_nombre,
        h.cupos_horario,
        h.inscriptos_horario,
        (h.cupos_horario - h.inscriptos_horario) as cupos_disponibles,
        a.nombre as actividad_nombre,
        a.descripcion as actividad_descripcion,
        a.requiere_talla,
        a.cupos as actividad_cupos,
        t.nombre as tipo_nombre
      FROM Horarios h
      INNER JOIN Actividades a ON h.id_actividad = a.id
      INNER JOIN TiposActividades t ON a.tipo_id = t.id
      WHERE h.id_horario = ?
    `, [horarioId]);
  }

  /**
   * Obtiene horarios de actividades por tipo que no han finalizado
   * @param {number} tipoId - ID del tipo de actividad
   * @param {string} fechaActual - Fecha actual en formato ISO
   */
  async findHorariosByTipo(tipoId, fechaActual) {
    return await queryAll(`
      SELECT 
        h.id_horario,
        h.fecha_inicio,
        h.fecha_fin,
        h.cuidador_nombre,
        h.cupos_horario,
        h.inscriptos_horario,
        (h.cupos_horario - h.inscriptos_horario) as cupos_disponibles,
        a.id as actividad_id,
        a.nombre as actividad_nombre,
        a.descripcion as actividad_descripcion,
        a.requiere_talla,
        t.nombre as tipo_nombre,
        t.codigo as tipo_codigo
      FROM Horarios h
      INNER JOIN Actividades a ON h.id_actividad = a.id
      INNER JOIN TiposActividades t ON a.tipo_id = t.id
      WHERE t.id = ?
        AND h.fecha_fin > ?
        AND (h.cupos_horario - h.inscriptos_horario) > 0
      ORDER BY h.fecha_inicio, a.nombre
    `, [tipoId, fechaActual]);
  }

  /**
   * Actualiza el contador de inscriptos de un horario
   * @param {Object} db - Conexión a la base de datos
   * @param {number} horarioId - ID del horario
   * @param {number} cantidad - Cantidad a incrementar
   */
  async incrementarInscriptos(db, horarioId, cantidad) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE Horarios SET inscriptos_horario = inscriptos_horario + ? WHERE id_horario = ?`,
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
