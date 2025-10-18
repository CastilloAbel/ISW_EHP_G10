import inscripcionService from '../services/inscripciones.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Controlador para las peticiones relacionadas con Inscripciones
 */
class InscripcionesController {
  /**
   * POST /api/inscripciones
   * Crea una nueva inscripción
   */
  async crearInscripcion(req, res) {
    try {
      const result = await inscripcionService.crearInscripcion(req.body);

      return sendSuccess(
        res,
        {
          codigoReserva: result.codigoReserva,
          inscripcionIds: result.inscripcionIds,
          cantidadParticipantes: result.cantidadParticipantes
        },
        'Inscripción realizada con éxito',
        201
      );
    } catch (error) {
      console.error('Error al crear inscripción:', error);
      const statusCode = error.status || 500;
      const message = error.message || 'Error al procesar la inscripción';
      return sendError(res, message, statusCode);
    }
  }

  /**
   * GET /api/inscripciones/:codigoReserva
   * Obtiene los detalles de una inscripción por código de reserva
   */
  async getInscripcionByCodigoReserva(req, res) {
    try {
      const { codigoReserva } = req.params;
      const inscripcion = await inscripcionService.getInscripcionByCodigoReserva(codigoReserva);

      return sendSuccess(
        res,
        inscripcion,
        'Consulte con este código en recepción'
      );
    } catch (error) {
      console.error('Error al consultar inscripción:', error);
      const statusCode = error.status || 500;
      const message = error.message || 'Error al consultar inscripción';
      return sendError(res, message, statusCode);
    }
  }
}

export default new InscripcionesController();

