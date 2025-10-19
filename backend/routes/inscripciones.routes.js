import express from 'express';
import inscripcionController from '../controllers/inscripciones.controller.js';

const router = express.Router();

router.post('/', inscripcionController.crearInscripcion.bind(inscripcionController));

router.get('/:codigoReserva', inscripcionController.getInscripcionByCodigoReserva.bind(inscripcionController));

export default router;
