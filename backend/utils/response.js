/**
 * Utilidad para estandarizar las respuestas de la API
 */

/**
 * Envía una respuesta exitosa
 * @param {Object} res - Express response object
 * @param {*} data - Datos a enviar
 * @param {string} message - Mensaje descriptivo
 * @param {number} statusCode - Código HTTP (default: 200)
 */
export const sendSuccess = (res, data = null, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    error: null
  });
};

/**
 * Envía una respuesta de error
 * @param {Object} res - Express response object
 * @param {string} error - Mensaje de error
 * @param {number} statusCode - Código HTTP (default: 500)
 * @param {*} data - Datos adicionales opcionales
 */
export const sendError = (res, error = 'Error en el servidor', statusCode = 500, data = null) => {
  return res.status(statusCode).json({
    success: false,
    data,
    message: null,
    error
  });
};

