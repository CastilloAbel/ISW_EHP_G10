import actividadService from '../services/actividades.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Controlador para las peticiones relacionadas con Actividades
 */
class ActividadController {
  /**
   * GET /api/actividades
   * Obtiene todas las actividades disponibles
   */
  async getAllActividades(req, res) {
    try {
      const actividades = await actividadService.getAllActividades();
      return sendSuccess(res, actividades, 'Actividades obtenidas exitosamente');
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      return sendError(res, 'Error al obtener actividades', 500);
    }
  }

  /**
   * GET /api/actividades/:nombre/horarios
   * Obtiene los horarios disponibles para una actividad específica
   */
  async getHorariosByActividad(req, res) {
    try {
      const { nombre } = req.params;
      const horarios = await actividadService.getHorariosByActividad(nombre);
      return sendSuccess(res, horarios, 'Horarios obtenidos exitosamente');
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      return sendError(res, 'Error al obtener horarios', 500);
    }
  }

  /**
   * GET /api/actividades/:nombre/horarios/:id
   * Obtiene un horario específico
   */
  async getHorarioById(req, res) {
    try {
      const { nombre, id } = req.params;
      const horario = await actividadService.getHorarioById(nombre, id);
      return sendSuccess(res, horario, 'Horario obtenido exitosamente');
    } catch (error) {
      console.error('Error al obtener horario:', error);
      const statusCode = error.status || 500;
      const message = error.message || 'Error al obtener horario';
      return sendError(res, message, statusCode);
    }
  }
}

export default new ActividadController();

