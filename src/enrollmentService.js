// Servicio de inscripción - Implementación TDD
// Comienza vacío (RED) - Los tests fallarán inicialmente

const ERROR_SIN_CUPO = 'Sin cupo disponible para el horario seleccionado';
const ERROR_HORARIO = 'Horario no disponible';
const ERROR_TYC = 'Debe aceptar términos y condiciones';
const ERROR_TALLE = 'Falta talle de vestimenta';

// Actividades que requieren talle de vestimenta
const ACTIVIDADES_CON_TALLE = ['TIROLESA', 'PALESTRA'];

/**
 * Función principal para inscribir participantes a una actividad
 * @param {Object} solicitud - Datos de la solicitud de inscripción
 * @param {Object} catalog - Catálogo de actividades y horarios
 * @returns {Object} Resultado de la inscripción
 */
export function inscribir(solicitud, catalog) {
  const errores = [];
  
  // Validación: términos y condiciones
  if (!solicitud.terminosAceptados) {
    errores.push(ERROR_TYC);
    return { ok: false, errores };
  }
  
  // Buscar el horario en el catálogo
  const slot = catalog.findSlot(solicitud.actividad, solicitud.horarioId);
  
  // Validación: horario existe y está habilitado
  if (!slot || !slot.habilitado) {
    errores.push(ERROR_HORARIO);
    return { ok: false, errores };
  }
  
  // Validación: cupos disponibles
  const cantidadParticipantes = solicitud.participantes.length;
  if (slot.cuposDisponibles < cantidadParticipantes) {
    errores.push(ERROR_SIN_CUPO);
    return { ok: false, errores };
  }
  
  // Validación: talle de vestimenta si la actividad lo requiere
  const requiereTalle = ACTIVIDADES_CON_TALLE.includes(solicitud.actividad);
  if (requiereTalle) {
    const faltaTalle = solicitud.participantes.some(p => !p.talle);
    if (faltaTalle) {
      errores.push(ERROR_TALLE);
      return { ok: false, errores };
    }
  }
  
  // Si llegamos aquí, todas las validaciones pasaron
  // Actualizar cupos disponibles
  catalog.setCupos(
    solicitud.actividad, 
    solicitud.horarioId, 
    slot.cuposDisponibles - cantidadParticipantes
  );
  
  // Generar código de reserva único
  const codigoReserva = generarCodigoReserva(solicitud.actividad, solicitud.horarioId);
  
  return {
    ok: true,
    codigoReserva,
    errores: []
  };
}

/**
 * Genera un código único de reserva
 */
function generarCodigoReserva(actividad, horarioId) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${actividad.substring(0, 3)}-${horarioId}-${random}-${timestamp}`;
}
