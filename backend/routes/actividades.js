import express from 'express';
import { queryAll, queryOne } from '../config/database.js';

const router = express.Router();

/**
 * GET /api/actividades
 * Obtiene todas las actividades disponibles
 */
router.get('/', async (req, res) => {
  try {
    const actividades = await queryAll(`
      SELECT DISTINCT nombre, requiere_talla 
      FROM Actividades 
      ORDER BY nombre
    `);
    res.json(actividades);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
});

/**
 * GET /api/actividades/:nombre/horarios
 * Obtiene los horarios disponibles para una actividad específica
 */
router.get('/:nombre/horarios', async (req, res) => {
  try {
    const { nombre } = req.params;
    const now = new Date().toISOString();
    
    const horarios = await queryAll(`
      SELECT 
        id,
        fecha_inicio,
        fecha_fin,
        cupos,
        inscriptos,
        (cupos - inscriptos) as cupos_disponibles
      FROM Actividades
      WHERE UPPER(nombre) = UPPER(?)
        AND fecha_inicio > ?
        AND (cupos - inscriptos) >= 0
      ORDER BY fecha_inicio
    `, [nombre, now]);
    
    res.json(horarios);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ error: 'Error al obtener horarios' });
  }
});

/**
 * GET /api/actividades/:nombre/horarios/:id
 * Obtiene un horario específico
 */
router.get('/:nombre/horarios/:id', async (req, res) => {
  try {
    const { nombre, id } = req.params;
    
    const horario = await queryOne(`
      SELECT 
        id,
        nombre,
        fecha_inicio,
        fecha_fin,
        cupos,
        inscriptos,
        requiere_talla,
        (cupos - inscriptos) as cupos_disponibles
      FROM Actividades
      WHERE id = ? AND UPPER(nombre) = UPPER(?)
    `, [id, nombre]);
    
    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    
    res.json(horario);
  } catch (error) {
    console.error('Error al obtener horario:', error);
    res.status(500).json({ error: 'Error al obtener horario' });
  }
});

export default router;
