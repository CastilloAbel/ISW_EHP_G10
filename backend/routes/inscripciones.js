import express from 'express';
import { queryOne, execute, getDatabase } from '../config/database.js';

const router = express.Router();

// Actividades que requieren talle
const ACTIVIDADES_CON_TALLE = ['TIROLESA', 'PALESTRA'];

/**
 * POST /api/inscripciones
 * Crea una nueva inscripción
 */
router.post('/', async (req, res) => {
  const db = getDatabase();
  
  try {
    const { actividad, horarioId, participantes, terminosAceptados } = req.body;
    
    // Validaciones básicas
    if (!terminosAceptados) {
      return res.status(400).json({ 
        error: 'Debe aceptar términos y condiciones' 
      });
    }
    
    if (!participantes || participantes.length === 0) {
      return res.status(400).json({ 
        error: 'Debe incluir al menos un participante' 
      });
    }
    
    // Verificar que el horario existe y está disponible
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
    `, [horarioId, actividad]);
    
    if (!horario) {
      return res.status(404).json({ 
        error: 'Horario no disponible' 
      });
    }
    
    // Verificar que hay cupos suficientes
    const cantidadParticipantes = participantes.length;
    if (horario.cupos_disponibles < cantidadParticipantes) {
      return res.status(400).json({ 
        error: 'Sin cupo disponible para el horario seleccionado' 
      });
    }
    
    // Verificar que se incluya talle si la actividad lo requiere
    if (horario.requiere_talla) {
      const faltaTalle = participantes.some(p => !p.talla || p.talla.trim() === '');
      if (faltaTalle) {
        return res.status(400).json({ 
          error: 'Falta talle de vestimenta' 
        });
      }
    }
    
    // Iniciar transacción
    await new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    try {
      // Insertar cada participante y su inscripción
      const inscripcionIds = [];
      
      for (const participante of participantes) {
        // Insertar visitante
        const visitanteResult = await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO Visitantes (nombre, dni, edad, talla_vestimenta) VALUES (?, ?, ?, ?)`,
            [participante.nombre, participante.dni, participante.edad, participante.talla || null],
            function(err) {
              if (err) reject(err);
              else resolve({ lastID: this.lastID });
            }
          );
        });
        
        // Insertar inscripción
        const inscripcionResult = await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO Inscripcion (id_visitante, id_actividad, terminos_condicion, fecha_inscripcion) 
             VALUES (?, ?, ?, datetime('now'))`,
            [visitanteResult.lastID, horarioId, terminosAceptados ? 1 : 0],
            function(err) {
              if (err) reject(err);
              else resolve({ lastID: this.lastID });
            }
          );
        });
        
        inscripcionIds.push(inscripcionResult.lastID);
      }
      
      // Actualizar contador de inscriptos
      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE Actividades SET inscriptos = inscriptos + ? WHERE id = ?`,
          [cantidadParticipantes, horarioId],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      
      // Commit
      await new Promise((resolve, reject) => {
        db.run('COMMIT', (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      // Generar código de reserva
      const codigoReserva = generarCodigoReserva(actividad, horarioId, inscripcionIds[0]);
      
      res.status(201).json({
        ok: true,
        codigoReserva,
        inscripcionIds,
        mensaje: 'Inscripción realizada con éxito'
      });
      
    } catch (error) {
      // Rollback en caso de error
      await new Promise((resolve) => {
        db.run('ROLLBACK', () => resolve());
      });
      throw error;
    }
    
  } catch (error) {
    console.error('Error al crear inscripción:', error);
    res.status(500).json({ error: 'Error al procesar la inscripción' });
  } finally {
    db.close();
  }
});

/**
 * GET /api/inscripciones/:codigoReserva
 * Obtiene los detalles de una inscripción por código de reserva
 */
router.get('/:codigoReserva', async (req, res) => {
  try {
    const { codigoReserva } = req.params;
    
    // Por ahora retornamos un mensaje
    // En una implementación completa, guardaríamos el código en la DB
    res.json({ 
      codigoReserva,
      mensaje: 'Consulte con este código en recepción' 
    });
    
  } catch (error) {
    console.error('Error al consultar inscripción:', error);
    res.status(500).json({ error: 'Error al consultar inscripción' });
  }
});

/**
 * Genera un código único de reserva
 */
function generarCodigoReserva(actividad, horarioId, inscripcionId) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const actividadCode = actividad.substring(0, 3).toUpperCase();
  return `${actividadCode}-${horarioId}-${inscripcionId}-${random}${timestamp}`;
}

export default router;
