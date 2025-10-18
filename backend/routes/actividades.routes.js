import express from 'express';
import actividadController from '../controllers/actividades.controller.js';

const router = express.Router();

/**
 * GET /api/actividades
 * Obtiene todas las actividades disponibles
 */
router.get('/', actividadController.getAllActividades.bind(actividadController));

/**
 * GET /api/actividades/:nombre/horarios
 * Obtiene los horarios disponibles para una actividad específica
 */
router.get('/:nombre/horarios', actividadController.getHorariosByActividad.bind(actividadController));

/**
 * GET /api/actividades/:nombre/horarios/:id
 * Obtiene un horario específico
 */
router.get('/:nombre/horarios/:id', actividadController.getHorarioById.bind(actividadController));

export default router;
