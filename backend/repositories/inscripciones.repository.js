class InscripcionesRepository {

  async create(db, inscripcion) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO Inscripciones (id_visitante, id_horario, terminos_condicion, cantidad_personas, fecha_inscripcion) 
         VALUES (?, ?, ?, ?, datetime('now'))`,
        [
          inscripcion.id_visitante,
          inscripcion.id_horario,
          inscripcion.terminos_condicion ? 1 : 0,
          inscripcion.cantidad_personas || 1
        ],
        function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID });
        }
      );
    });
  }

  async findByVisitante(visitanteId) {
    return new Promise((resolve, reject) => {
      const db = require('../config/database.js').getDatabase();
      db.all(
        `SELECT 
          i.*,
          h.fecha_inicio,
          h.fecha_fin,
          a.nombre as actividad_nombre
         FROM Inscripciones i
         INNER JOIN Horarios h ON i.id_horario = h.id_horario
         INNER JOIN Actividades a ON h.id_actividad = a.id
         WHERE i.id_visitante = ?
         ORDER BY i.fecha_inscripcion DESC`,
        [visitanteId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}

export default new InscripcionesRepository();
