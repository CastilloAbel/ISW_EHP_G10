import actividadService from '../services/actividades.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

class ActividadController {
  async getAllTiposActividades(req, res) {
    try {
      const tipos = await actividadService.getAllTiposActividades();
      return sendSuccess(res, tipos, 'Tipos de actividades obtenidos exitosamente');
    } catch (error) {
      console.error('Error al obtener tipos de actividades:', error);
      return sendError(res, 'Error al obtener tipos de actividades', 500);
    }
  }

  async getAllActividades(req, res) {
    try {
      const { tipoId } = req.query;
      const actividades = await actividadService.getAllActividades(tipoId ? parseInt(tipoId) : null);
      return sendSuccess(res, actividades, 'Actividades obtenidas exitosamente');
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      return sendError(res, 'Error al obtener actividades', 500);
    }
  }

  async getHorariosByActividad(req, res) {
    try {
      const { id } = req.params;
      const horarios = await actividadService.getHorariosByActividad(parseInt(id));
      return sendSuccess(res, horarios, 'Horarios obtenidos exitosamente');
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      return sendError(res, 'Error al obtener horarios', 500);
    }
  }

  async getHorariosByTipo(req, res) {
    try {
      const { tipoId } = req.params;
      const horarios = await actividadService.getHorariosByTipo(parseInt(tipoId));
      return sendSuccess(res, horarios, 'Horarios por tipo obtenidos exitosamente');
    } catch (error) {
      console.error('Error al obtener horarios por tipo:', error);
      return sendError(res, 'Error al obtener horarios por tipo', 500);
    }
  }

  async getHorarioById(req, res) {
    try {
      const { id } = req.params;
      const horario = await actividadService.getHorarioById(parseInt(id));
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
