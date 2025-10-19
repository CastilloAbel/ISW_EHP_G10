import { useState } from "react";
import { motion } from "framer-motion";
import { Trees, Sparkles } from "lucide-react";

import EnrollmentForm from "./components/EnrollmentForm";
import SuccessModal from "./components/SuccessModal";

function App() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState("");

  const handleSuccess = (code: string) => {
    setReservationCode(code);
    setShowSuccess(true);
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    setReservationCode("");
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.2,
        type: "spring",
        stiffness: 200,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <motion.header
        animate="visible"
        className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl"
        initial="hidden"
        variants={headerVariants}
      >
        <div className="container mx-auto px-4 py-8">
          <motion.div className="text-center" variants={titleVariants}>
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Trees className="w-10 h-10" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold">
                EcoHarmony Park
              </h1>
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  delay: 0.5,
                }}
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
            </div>
            <motion.p
              animate={{ opacity: 1 }}
              className="text-xl text-green-100"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              Tu aventura comienza aquí
            </motion.p>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <section className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Inscripción a Actividades
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Completa el formulario para reservar tu lugar en nuestras
              emocionantes actividades.
              <span className="text-green-600 font-semibold">
                {" "}
                ¡La naturaleza te espera!
              </span>
            </p>
          </section>

          <EnrollmentForm onSuccess={handleSuccess} />
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 mt-16"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            &copy; 2025 EcoHarmony Park - Donde la aventura y la naturaleza se
            encuentran
          </p>
        </div>
      </motion.footer>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal code={reservationCode} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
