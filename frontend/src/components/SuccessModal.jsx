import './SuccessModal.css';

const SuccessModal = ({ code, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="success-icon">✓</div>
          <h2>¡Inscripción Exitosa!</h2>
        </div>

        <div className="modal-body">
          <p>Tu reserva ha sido confirmada.</p>
          <div className="reservation-code">
            <label>Código de Reserva:</label>
            <div className="code-box">{code}</div>
          </div>
          <p className="info-text">
            Guarda este código para consultar tu reserva.
            Deberás presentarlo en la recepción del parque.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
