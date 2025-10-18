import actividadRepository from '../repositories/actividades.repository.js';

/**
 * Servicio para la lógica de negocio de Actividades
 */
class ActividadesService {
  /**
   * Obtiene todas las actividades disponibles
   */
  async getAllActividades() {
    const actividades = await actividadRepository.findAllActividades();
    return actividades;
  }

  /**
   * Obtiene los horarios disponibles para una actividad
   * @param {string} nombreActividad - Nombre de la actividad
   */
  async getHorariosByActividad(nombreActividad) {
    const now = new Date().toISOString();
    const horarios = await actividadRepository.findHorariosByActividad(nombreActividad, now);
    return horarios;
  }

  /**
   * Obtiene un horario específico
   * @param {string} nombreActividad - Nombre de la actividad
   * @param {number} horarioId - ID del horario
   */
  async getHorarioById(nombreActividad, horarioId) {
    const horario = await actividadRepository.findHorarioById(horarioId, nombreActividad);

    if (!horario) {
      throw { status: 404, message: 'Horario no encontrado' };
    }

    return horario;
  }
}

export default new ActividadesService();

