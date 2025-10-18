import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, FileText, Copy, Check } from 'lucide-react';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { useState } from 'react';

interface SuccessModalProps {
  code: string;
  onClose: () => void;
}

const SuccessModal = ({ code, onClose }: SuccessModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const checkIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 200,
        delay: 0.2
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl relative">
            <CardBody className="p-8">
              {/* Botón cerrar en la esquina */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-default-100 rounded-full transition-colors z-10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-default-500" />
              </motion.button>

              {/* Header con icono de éxito */}
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  variants={checkIconVariants}
                  className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="w-12 h-12 text-success-600" />
                </motion.div>

                <motion.h2
                  variants={itemVariants}
                  className="text-2xl font-bold text-center bg-gradient-to-r from-success-600 to-success-400 bg-clip-text text-transparent"
                >
                  ¡Inscripción Exitosa!
                </motion.h2>
              </div>

              {/* Contenido */}
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.p
                  variants={itemVariants}
                  className="text-center text-default-600"
                >
                  Tu reserva ha sido confirmada exitosamente.
                </motion.p>

                {/* Código de reserva */}
                <motion.div
                  variants={itemVariants}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-2 text-sm font-medium text-default-700">
                    <FileText className="w-4 h-4" />
                    Código de Reserva:
                  </label>

                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-lg p-4 flex items-center justify-between group">
                      <span className="text-2xl font-bold text-primary-700 tracking-wider">
                        {code}
                      </span>

                      <motion.button
                        onClick={handleCopy}
                        className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Copiar código"
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                            >
                              <Check className="w-5 h-5 text-success-600" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Copy className="w-5 h-5 text-primary-600" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Información adicional */}
                <motion.div
                  variants={itemVariants}
                  className="bg-warning-50 border-l-4 border-warning-500 p-4 rounded-r-lg"
                >
                  <p className="text-sm text-warning-800">
                    <strong>Importante:</strong> Guarda este código para consultar tu reserva.
                    Deberás presentarlo en la recepción del parque.
                  </p>
                </motion.div>

                {/* Botón */}
                <motion.div
                  variants={itemVariants}
                  className="pt-4"
                >
                  <Button
                    onPress={onClose}
                    color="primary"
                    size="lg"
                    className="w-full font-semibold shadow-lg"
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Aceptar
                  </Button>
                </motion.div>
              </motion.div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SuccessModal;
