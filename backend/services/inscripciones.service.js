import { getDatabase } from '../config/database.js';
import actividadRepository from '../repositories/actividades.repository.js';
import visitantesService from './visitantes.service.js';
import inscripcionRepository from '../repositories/inscripciones.repository.js';

/**
 * Servicio para la lógica de negocio de Inscripciones
 */
class InscripcionesService {
  /**
   * Valida los datos de la inscripción
   */
  validateInscripcion(data) {
    const { horarioId, participantes, terminosAceptados } = data;

    if (!terminosAceptados) {
      throw { status: 400, message: 'Debe aceptar términos y condiciones' };
    }

    if (!participantes || participantes.length === 0) {
      throw { status: 400, message: 'Debe incluir al menos un participante' };
    }

    if (!horarioId) {
      throw { status: 400, message: 'Horario es requerido' };
    }
  }

  /**
   * Valida que hay cupos disponibles
   */
  validateCuposDisponibles(horario, cantidadParticipantes) {
    if (horario.cupos_disponibles < cantidadParticipantes) {
      throw { status: 400, message: 'Sin cupo disponible para el horario seleccionado' };
    }
  }

  /**
   * Valida que se incluyan tallas cuando es requerido
   */
  validateTallas(horario, participantes) {
    if (horario.requiere_talla) {
      const faltaTalle = participantes.some(p => !p.talla || p.talla.trim() === '');
      if (faltaTalle) {
        throw { status: 400, message: 'Falta talle de vestimenta' };
      }
    }
  }

  /**
   * Genera un código único de reserva
   */
  generarCodigoReserva(actividad, horarioId, inscripcionId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const actividadCode = actividad.substring(0, 3).toUpperCase();
    return `${actividadCode}-${horarioId}-${inscripcionId}-${random}${timestamp}`;
  }

  /**
   * Crea una nueva inscripción
   */
  async crearInscripcion(data) {
    const { horarioId, participantes, terminosAceptados } = data;

    // Validar datos básicos
    this.validateInscripcion(data);

    // Verificar que el horario existe y está disponible
    const horario = await actividadRepository.findHorarioById(horarioId);

    if (!horario) {
      throw { status: 404, message: 'Horario no disponible' };
    }

    // Validar cupos
    const cantidadParticipantes = participantes.length;
    this.validateCuposDisponibles(horario, cantidadParticipantes);

    // Validar tallas
    this.validateTallas(horario, participantes);

    // Iniciar transacción
    const db = getDatabase();

    try {
      await this.beginTransaction(db);

      const inscripcionIds = [];

      // Insertar cada participante y su inscripción usando el servicio de visitantes
      for (const participante of participantes) {
        // Crear visitante a través del servicio
        const visitanteResult = await visitantesService.crearVisitante(db, participante);

        // Insertar inscripción
        const inscripcionResult = await inscripcionRepository.create(db, {
          id_visitante: visitanteResult.lastID,
          id_horario: horarioId,
          terminos_condicion: terminosAceptados,
          cantidad_personas: 1
        });

        inscripcionIds.push(inscripcionResult.lastID);
      }

      // Actualizar contador de inscriptos
      await actividadRepository.incrementarInscriptos(db, horarioId, cantidadParticipantes);

      // Commit
      await this.commitTransaction(db);

      // Generar código de reserva
      const codigoReserva = this.generarCodigoReserva(horario.actividad_nombre, horarioId, inscripcionIds[0]);

      db.close();

      return {
        codigoReserva,
        inscripcionIds,
        cantidadParticipantes
      };

    } catch (error) {
      // Rollback en caso de error
      await this.rollbackTransaction(db);
      db.close();
      throw error;
    }
  }

  /**
   * Obtiene información de una inscripción por código de reserva
   */
  async getInscripcionByCodigoReserva(codigoReserva) {
    // Por ahora retornamos el código
    // En una implementación completa, guardaríamos el código en la DB
    return {
      codigoReserva
    };
  }

  /**
   * Inicia una transacción
   */
  beginTransaction(db) {
    return new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Confirma una transacción
   */
  commitTransaction(db) {
    return new Promise((resolve, reject) => {
      db.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Revierte una transacción
   */
  rollbackTransaction(db) {
    return new Promise((resolve) => {
      db.run('ROLLBACK', () => resolve());
    });
  }
}

export default new InscripcionesService();
