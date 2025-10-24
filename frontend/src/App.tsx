import { useState } from "react";
import { motion } from "framer-motion";

import EnrollmentForm from "./components/EnrollmentForm";
import SuccessModal from "./components/SuccessModal";
import { AnimatedThemeToggler } from "./components/AnimatedThemeToggler";
import logo from "./assets/logo.png";

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <motion.header
        animate="visible"
        className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-800 dark:via-emerald-800 dark:to-teal-900 text-white shadow-2xl relative overflow-hidden"
        initial="hidden"
        variants={headerVariants}
      >
        {/* Decorative background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container mx-auto px-4 py-6 md:py-10 relative z-10">
          <div className="absolute top-4 right-4 md:top-6 md:right-8">
            <AnimatedThemeToggler className="p-3 md:p-4" />
          </div>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-6"
            variants={titleVariants}
          >
            {/* Logo */}
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              className="flex-shrink-0"
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                alt="EcoHarmony Park Logo"
                className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain drop-shadow-2xl"
                src={logo}
              />
            </motion.div>

            {/* Title and Tagline */}
            <div className="text-center md:text-left">
              <motion.h1
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                EcoHarmony Park
              </motion.h1>
              <motion.p
                animate={{ opacity: 1 }}
                className="text-lg md:text-xl lg:text-2xl text-green-50 font-light"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
                Tu aventura comienza aquí
              </motion.p>
              <motion.div
                animate={{ scaleX: 1 }}
                className="mt-3 h-1 bg-white/30 rounded-full max-w-md mx-auto md:mx-0"
                initial={{ scaleX: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              />
            </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Inscripción a Actividades
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Completa el formulario para reservar tu lugar en nuestras
              emocionantes actividades.
              <span className="text-green-600 dark:text-green-400 font-semibold">
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
