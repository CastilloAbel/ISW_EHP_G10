/**
 * Repositorio para operaciones de base de datos relacionadas con Inscripciones
 */
class InscripcionesRepository {
  /**
   * Crea una nueva inscripción
   * @param {Object} db - Conexión a la base de datos
   * @param {Object} inscripcion - Datos de la inscripción
   */
  async create(db, inscripcion) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO Inscripcion (id_visitante, id_actividad, terminos_condicion, fecha_inscripcion) 
         VALUES (?, ?, ?, datetime('now'))`,
        [inscripcion.id_visitante, inscripcion.id_actividad, inscripcion.terminos_condicion ? 1 : 0],
        function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID });
        }
      );
    });
  }
}

export default new InscripcionesRepository();

