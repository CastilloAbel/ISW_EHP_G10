import visitanteRepository from '../repositories/visitantes.repository.js';

/**
 * Servicio para la lógica de negocio de Visitantes
 */
class VisitantesService {
  /**
   * Valida los datos de un visitante
   */
  validateVisitante(visitante) {
    if (!visitante.nombre || visitante.nombre.trim() === '') {
      throw { status: 400, message: 'El nombre del visitante es requerido' };
    }

    if (!visitante.dni || visitante.dni.trim() === '') {
      throw { status: 400, message: 'El DNI del visitante es requerido' };
    }

    if (!visitante.edad || visitante.edad <= 0) {
      throw { status: 400, message: 'La edad del visitante es requerida y debe ser mayor a 0' };
    }
  }

  /**
   * Crea un nuevo visitante
   * @param {Object} db - Conexión a la base de datos
   * @param {Object} visitante - Datos del visitante
   */
  async crearVisitante(db, visitante) {
    // Validar datos del visitante
    this.validateVisitante(visitante);

    // Crear visitante en el repositorio
    const result = await visitanteRepository.create(db, visitante);

    return result;
  }

  /**
   * Crea múltiples visitantes
   * @param {Object} db - Conexión a la base de datos
   * @param {Array} visitantes - Array de visitantes
   */
  async crearVisitantes(db, visitantes) {
    const visitantesIds = [];

    for (const visitante of visitantes) {
      const result = await this.crearVisitante(db, visitante);
      visitantesIds.push(result.lastID);
    }

    return visitantesIds;
  }
}

export default new VisitantesService();

