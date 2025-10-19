import actividadRepository from '../repositories/actividades.repository.js';

class ActividadesService {

  async getAllTiposActividades() {
    const tipos = await actividadRepository.findAllTiposActividades();
    return tipos;
  }

  async getAllActividades(tipoId = null) {
    const actividades = await actividadRepository.findAllActividades(tipoId);
    console.log(actividades);
    return actividades;
  }

  async getHorariosByActividad(actividadId) {
    const now = new Date().toISOString();
    const horarios = await actividadRepository.findHorariosByActividad(actividadId, now);
    return horarios;
  }

  /**
   * Obtiene un horario específico
   * @param {number} horarioId - ID del horario
   */
  async getHorarioById(horarioId) {
    const horario = await actividadRepository.findHorarioById(horarioId);

    if (!horario) {
      throw { status: 404, message: 'Horario no encontrado' };
    }

    return horario;
  }

  /**
   * Obtiene horarios de actividades por tipo que no han finalizado
   * @param {number} tipoId - ID del tipo de actividad
   */
  async getHorariosByTipo(tipoId) {
    const now = new Date().toISOString();
    const horarios = await actividadRepository.findHorariosByTipo(tipoId, now);
    return horarios;
  }
}

export default new ActividadesService();
