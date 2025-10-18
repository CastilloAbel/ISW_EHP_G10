import express from 'express';
import inscripcionController from '../controllers/inscripciones.controller.js';

const router = express.Router();

/**
 * POST /api/inscripciones
 * Crea una nueva inscripción
 */
router.post('/', inscripcionController.crearInscripcion.bind(inscripcionController));

/**
 * GET /api/inscripciones/:codigoReserva
 * Obtiene los detalles de una inscripción por código de reserva
 */
router.get('/:codigoReserva', inscripcionController.getInscripcionByCodigoReserva.bind(inscripcionController));

export default router;
