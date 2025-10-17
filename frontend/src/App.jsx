import { useState } from 'react';
import './App.css';
import EnrollmentForm from './components/EnrollmentForm';
import SuccessModal from './components/SuccessModal';

function App() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState('');

  const handleSuccess = (code) => {
    setReservationCode(code);
    setShowSuccess(true);
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    setReservationCode('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🌳 EcoHarmony Park</h1>
          <p className="subtitle">Tu aventura comienza aquí</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <section className="welcome-section">
            <h2>Inscripción a Actividades</h2>
            <p>
              Completa el formulario para reservar tu lugar en nuestras emocionantes actividades.
              ¡La naturaleza te espera!
            </p>
          </section>

          <EnrollmentForm onSuccess={handleSuccess} />
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 EcoHarmony Park - Donde la aventura y la naturaleza se encuentran</p>
      </footer>

      {showSuccess && (
        <SuccessModal 
          code={reservationCode} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

export default App;
