import express from 'express';
import actividadController from '../controllers/actividades.controller.js';

const router = express.Router();

router.get('/tipos',
    actividadController.getAllTiposActividades.bind(actividadController));

router.get('/tipos/:tipoId/horarios',
    actividadController.getHorariosByTipo.bind(actividadController));

router.get('/horarios/:id',
    actividadController.getHorarioById.bind(actividadController));

router.get('/',
    actividadController.getAllActividades.bind(actividadController));

router.get('/:id/horarios',
    actividadController.getHorariosByActividad.bind(actividadController));

export default router;
