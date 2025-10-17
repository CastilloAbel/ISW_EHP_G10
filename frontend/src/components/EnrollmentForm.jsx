import { useState, useEffect } from 'react';
import './EnrollmentForm.css';

const API_URL = 'http://localhost:3000/api';

const ACTIVIDADES_CON_TALLE = ['TIROLESA', 'PALESTRA'];

const EnrollmentForm = ({ onSuccess }) => {
  const [actividades, setActividades] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    actividad: '',
    horarioId: '',
    cantidadPersonas: 1,
    participantes: [{ nombre: '', dni: '', edad: '', talla: '' }],
    terminosAceptados: false
  });

  // Cargar actividades al montar el componente
  useEffect(() => {
    fetchActividades();
  }, []);

  // Cargar horarios cuando cambia la actividad
  useEffect(() => {
    if (formData.actividad) {
      fetchHorarios(formData.actividad);
    } else {
      setHorarios([]);
    }
  }, [formData.actividad]);

  const fetchActividades = async () => {
    try {
      const response = await fetch(`${API_URL}/actividades`);
      const data = await response.json();
      setActividades(data);
    } catch (err) {
      setError('Error al cargar actividades');
      console.error(err);
    }
  };

  const fetchHorarios = async (actividad) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/actividades/${actividad}/horarios`);
      const data = await response.json();
      setHorarios(data);
    } catch (err) {
      setError('Error al cargar horarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActividadChange = (e) => {
    const actividad = e.target.value;
    setFormData({
      ...formData,
      actividad,
      horarioId: '',
      participantes: formData.participantes.map(p => ({ ...p, talla: '' }))
    });
  };

  const handleCantidadChange = (e) => {
    const cantidad = parseInt(e.target.value) || 1;
    const nuevosParticipantes = Array(cantidad).fill(null).map((_, i) => 
      formData.participantes[i] || { nombre: '', dni: '', edad: '', talla: '' }
    );
    setFormData({ ...formData, cantidadPersonas: cantidad, participantes: nuevosParticipantes });
  };

  const handleParticipanteChange = (index, field, value) => {
    const nuevosParticipantes = [...formData.participantes];
    nuevosParticipantes[index] = { ...nuevosParticipantes[index], [field]: value };
    setFormData({ ...formData, participantes: nuevosParticipantes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones del lado del cliente
      if (!formData.actividad) {
        throw new Error('Debe seleccionar una actividad');
      }

      if (!formData.horarioId) {
        throw new Error('Debe seleccionar un horario');
      }

      if (!formData.terminosAceptados) {
        throw new Error('Debe aceptar los términos y condiciones');
      }

      // Validar que todos los participantes tengan datos completos
      const requiereTalle = ACTIVIDADES_CON_TALLE.includes(formData.actividad);
      for (let i = 0; i < formData.participantes.length; i++) {
        const p = formData.participantes[i];
        if (!p.nombre || !p.dni || !p.edad) {
          throw new Error(`Complete todos los datos del participante ${i + 1}`);
        }
        if (requiereTalle && !p.talla) {
          throw new Error(`Debe indicar la talla del participante ${i + 1}`);
        }
      }

      const response = await fetch(`${API_URL}/inscripciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la inscripción');
      }

      // Éxito
      onSuccess(data.codigoReserva);
      
      // Resetear formulario
      setFormData({
        actividad: '',
        horarioId: '',
        cantidadPersonas: 1,
        participantes: [{ nombre: '', dni: '', edad: '', talla: '' }],
        terminosAceptados: false
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const requiereTalle = ACTIVIDADES_CON_TALLE.includes(formData.actividad);

  return (
    <form className="enrollment-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      {/* Selección de actividad */}
      <div className="form-group">
        <label htmlFor="actividad">Actividad *</label>
        <select
          id="actividad"
          value={formData.actividad}
          onChange={handleActividadChange}
          required
          className="form-control"
        >
          <option value="">Seleccione una actividad</option>
          {actividades.map(act => (
            <option key={act.nombre} value={act.nombre.toUpperCase()}>
              {act.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Selección de horario */}
      {formData.actividad && (
        <div className="form-group">
          <label htmlFor="horario">Horario *</label>
          <select
            id="horario"
            value={formData.horarioId}
            onChange={(e) => setFormData({ ...formData, horarioId: e.target.value })}
            required
            className="form-control"
            disabled={loading || horarios.length === 0}
          >
            <option value="">Seleccione un horario</option>
            {horarios.map(h => (
              <option key={h.id} value={h.id}>
                {new Date(h.fecha_inicio).toLocaleString('es-AR')} - 
                Cupos disponibles: {h.cupos_disponibles}
              </option>
            ))}
          </select>
          {horarios.length === 0 && !loading && (
            <small className="form-text">No hay horarios disponibles para esta actividad</small>
          )}
        </div>
      )}

      {/* Cantidad de personas */}
      <div className="form-group">
        <label htmlFor="cantidad">Cantidad de personas *</label>
        <input
          type="number"
          id="cantidad"
          min="1"
          max="10"
          value={formData.cantidadPersonas}
          onChange={handleCantidadChange}
          required
          className="form-control"
        />
      </div>

      {/* Datos de participantes */}
      <div className="participantes-section">
        <h3>Datos de los participantes</h3>
        {formData.participantes.map((p, index) => (
          <div key={index} className="participante-card">
            <h4>Participante {index + 1}</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label>Nombre completo *</label>
                <input
                  type="text"
                  value={p.nombre}
                  onChange={(e) => handleParticipanteChange(index, 'nombre', e.target.value)}
                  required
                  className="form-control"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="form-group">
                <label>DNI *</label>
                <input
                  type="text"
                  value={p.dni}
                  onChange={(e) => handleParticipanteChange(index, 'dni', e.target.value)}
                  required
                  className="form-control"
                  placeholder="Ej: 12345678"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Edad *</label>
                <input
                  type="number"
                  value={p.edad}
                  onChange={(e) => handleParticipanteChange(index, 'edad', e.target.value)}
                  required
                  min="1"
                  max="120"
                  className="form-control"
                  placeholder="Ej: 25"
                />
              </div>

              {requiereTalle && (
                <div className="form-group">
                  <label>Talla de vestimenta *</label>
                  <select
                    value={p.talla}
                    onChange={(e) => handleParticipanteChange(index, 'talla', e.target.value)}
                    required
                    className="form-control"
                  >
                    <option value="">Seleccione</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Términos y condiciones */}
      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.terminosAceptados}
            onChange={(e) => setFormData({ ...formData, terminosAceptados: e.target.checked })}
            required
          />
          <span>
            Acepto los términos y condiciones de la actividad *
          </span>
        </label>
      </div>

      {/* Botón de envío */}
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Procesando...' : 'Confirmar Inscripción'}
      </button>
    </form>
  );
};

export default EnrollmentForm;
