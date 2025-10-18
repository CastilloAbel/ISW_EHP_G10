/**
 * Repositorio para operaciones de base de datos relacionadas con Visitantes
 */
class VisitantesRepository {
    /**
     * Crea un nuevo visitante
     * @param {Object} db - Conexión a la base de datos
     * @param {Object} visitante - Datos del visitante
     */
    async create(db, visitante) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Visitantes (nombre, dni, edad, talla_vestimenta) VALUES (?, ?, ?, ?)`,
                [visitante.nombre, visitante.dni, visitante.edad, visitante.talla || null],
                function(err) {
                    if (err) reject(err);
                    else resolve({ lastID: this.lastID });
                }
            );
        });
    }
}

export default new VisitantesRepository();
