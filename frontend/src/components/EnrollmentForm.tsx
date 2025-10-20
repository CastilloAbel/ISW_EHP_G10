import type {
  Participante,
  TipoActividad,
  Actividad,
  FormData,
} from "../types";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Card, CardBody, Checkbox } from "@heroui/react";
import { AlertCircle, CheckCircle2, User } from "lucide-react";

import TermsModal from "./TermsModal";
import ConfirmationModal from "./ConfirmationModal";
import { ActivitySelector } from "./enrollment/ActivitySelector";
import { ParticipantCard } from "./enrollment/ParticipantCard";

const API_URL = "http://localhost:3000/api";

interface EnrollmentFormProps {
  onSuccess: (code: string) => void;
}

const EnrollmentForm = ({ onSuccess }: EnrollmentFormProps) => {
  const MAX_PARTICIPANTES = 20; // Límite máximo de participantes

  const [tiposActividades, setTiposActividades] = useState<TipoActividad[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    tipoActividad: "",
    actividad: "",
    horarioId: "",
    cantidadPersonas: 1,
    participantes: [{ nombre: "", dni: "", edad: "", talla: "" }],
    terminosAceptados: false,
  });

  useEffect(() => {
    fetchTiposActividades();
  }, []);

  useEffect(() => {
    if (formData.tipoActividad) {
      fetchActividadesByTipo(formData.tipoActividad);
    } else {
      setActividades([]);
      setHorarios([]);
    }
  }, [formData.tipoActividad]);

  useEffect(() => {
    if (formData.actividad) {
      fetchHorarios(formData.actividad);
    } else {
      setHorarios([]);
    }
  }, [formData.actividad]);

  const fetchTiposActividades = async () => {
    try {
      const response = await fetch(`${API_URL}/actividades/tipos`);
      const result = await response.json();

      console.log("tipos de actividades", result);

      if (result.success && result.data) {
        setTiposActividades(result.data);
      } else {
        setError(result.message || "Error al cargar tipos de actividades");
      }
    } catch (err) {
      setError("Error al cargar tipos de actividades");
      console.error(err);
    }
  };

  const fetchActividadesByTipo = async (tipoId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/actividades?tipoId=${tipoId}`);
      const result = await response.json();

      console.log("actividades por tipo", result);

      if (result.success && result.data) {
        setActividades(result.data);
      } else {
        setError(result.message || "Error al cargar actividades");
        setActividades([]);
      }
    } catch (err) {
      setError("Error al cargar actividades");
      console.error(err);
      setActividades([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHorarios = async (actividadId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/actividades/${actividadId}/horarios`,
      );
      const result = await response.json();

      console.log("horarios", result);

      if (result.success && result.data) {
        setHorarios(result.data);
      } else {
        setError(result.message || "Error al cargar horarios");
        setHorarios([]);
      }
    } catch (err) {
      setError("Error al cargar horarios");
      console.error(err);
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTipoActividadChange = (value: string) => {
    setFormData({
      ...formData,
      tipoActividad: value,
      actividad: "",
      horarioId: "",
      participantes: formData.participantes.map((p) => ({ ...p, talla: "" })),
    });
  };

  const handleActividadChange = (value: string) => {
    setFormData({
      ...formData,
      actividad: value,
      horarioId: "",
      participantes: formData.participantes.map((p) => ({ ...p, talla: "" })),
    });
  };

  const handleCantidadChange = (value: string) => {
    const cantidad = parseInt(value) || 1;

    // Validar que no exceda el máximo permitido
    if (cantidad > MAX_PARTICIPANTES) {
      setError(`El número máximo de participantes es ${MAX_PARTICIPANTES}`);
      return;
    }

    // Limpiar error si había uno previo
    if (error && error.includes("número máximo de participantes")) {
      setError("");
    }

    const nuevosParticipantes = Array(cantidad)
      .fill(null)
      .map(
        (_, i) =>
          formData.participantes[i] || {
            nombre: "",
            dni: "",
            edad: "",
            talla: "",
          },
      );

    setFormData({
      ...formData,
      cantidadPersonas: cantidad,
      participantes: nuevosParticipantes,
    });
  };

  const handleParticipanteChange = (
    index: number,
    field: keyof Participante,
    value: string,
  ) => {
    const nuevosParticipantes = [...formData.participantes];

    nuevosParticipantes[index] = {
      ...nuevosParticipantes[index],
      [field]: value,
    };
    setFormData({ ...formData, participantes: nuevosParticipantes });
  };

  const validateFormBeforeSubmit = () => {
    if (!formData.tipoActividad) {
      throw new Error("Debe seleccionar un tipo de actividad");
    }

    if (!formData.actividad) {
      throw new Error("Debe seleccionar una actividad");
    }

    if (!formData.horarioId) {
      throw new Error("Debe seleccionar un horario");
    }

    if (!formData.terminosAceptados) {
      throw new Error("Debe aceptar los términos y condiciones");
    }

    // Buscar la actividad seleccionada para verificar si requiere talla
    const actividadSeleccionada = actividades.find(
      (act) => act.id.toString() === formData.actividad,
    );
    const requiereTalle = actividadSeleccionada?.requiere_talla === 1;

    for (let i = 0; i < formData.participantes.length; i++) {
      const p = formData.participantes[i];

      if (!p.nombre || !p.dni || !p.edad) {
        throw new Error(`Complete todos los datos del participante ${i + 1}`);
      }

      // Validar longitud del DNI
      if (p.dni.length < 7 || p.dni.length > 8) {
        throw new Error(`El DNI del participante ${i + 1} debe tener entre 7 y 8 dígitos`);
      }

      // Validar nombre
      if (p.nombre.length < 3) {
        throw new Error(`El nombre del participante ${i + 1} debe tener al menos 3 caracteres`);
      }

      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(p.nombre)) {
        throw new Error(`El nombre del participante ${i + 1} solo puede contener letras`);
      }

      // Validar edad
      const edad = parseInt(p.edad);
      if (isNaN(edad) || edad < 1 || edad > 120) {
        throw new Error(`La edad del participante ${i + 1} debe estar entre 1 y 120 años`);
      }

      if (requiereTalle && !p.talla) {
        throw new Error(`Debe indicar la talla del participante ${i + 1}`);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      validateFormBeforeSubmit();
      // Si pasa todas las validaciones, abrir el modal de confirmación
      setConfirmModalOpen(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/inscripciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          horarioId: formData.horarioId,
          terminosAceptados: formData.terminosAceptados,
          participantes: formData.participantes.map((p) => ({
            nombre: p.nombre,
            dni: p.dni,
            edad: parseInt(p.edad),
            talla: p.talla || undefined,
          })),
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || result.error || "Error al procesar la inscripción",
        );
      }

      // El código de reserva debería estar en result.data
      const codigoReserva = result.data?.codigoReserva || result.codigoReserva;

      setConfirmModalOpen(false);
      onSuccess(codigoReserva);

      setFormData({
        tipoActividad: "",
        actividad: "",
        horarioId: "",
        cantidadPersonas: 1,
        participantes: [{ nombre: "", dni: "", edad: "", talla: "" }],
        terminosAceptados: false,
      });
    } catch (err: any) {
      setError(err.message);
      setConfirmModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Verificar si la actividad seleccionada requiere talla
  const actividadSeleccionada = actividades.find(
    (act) => act.id.toString() === formData.actividad,
  );
  const requiereTalle = actividadSeleccionada?.requiere_talla === 1;

  // Preparar datos para el modal de confirmación
  const tipoActividadNombre = tiposActividades.find(
    (t) => t.id.toString() === formData.tipoActividad,
  )?.nombre || "";

  const actividadNombre = actividades.find(
    (a) => a.id.toString() === formData.actividad,
  )?.nombre || "";

  const horarioSeleccionado = horarios.find(
    (h) => h.id_horario.toString() === formData.horarioId,
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { dateStr, timeStr };
  };

  const confirmationData = horarioSeleccionado
    ? {
        tipoActividad: tipoActividadNombre,
        actividad: actividadNombre,
        horario: {
          fecha: formatDateTime(horarioSeleccionado.fecha_inicio).dateStr,
          horaInicio: formatDateTime(horarioSeleccionado.fecha_inicio).timeStr,
          horaFin: formatDateTime(horarioSeleccionado.fecha_fin).timeStr,
          cuidador: horarioSeleccionado.cuidador_nombre,
          cuposDisponibles: horarioSeleccionado.cupos_disponibles,
        },
        participantes: formData.participantes,
        requiereTalle,
      }
    : null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.form
        animate="visible"
        className="w-full max-w-4xl mx-auto space-y-6"
        initial="hidden"
        variants={containerVariants}
        onSubmit={handleFormSubmit}
      >
        {error && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="bg-danger-50 border-l-4 border-danger-500 p-4 rounded-lg flex items-start gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
          >
            <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
            <p className="text-danger-700 text-sm">{error}</p>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <ActivitySelector
            actividades={actividades}
            cantidadPersonas={formData.cantidadPersonas}
            horarios={horarios}
            loading={loading}
            selectedActividad={formData.actividad}
            selectedHorarioId={formData.horarioId}
            selectedTipoActividad={formData.tipoActividad}
            tiposActividades={tiposActividades}
            onActividadChange={handleActividadChange}
            onCantidadChange={handleCantidadChange}
            onHorarioChange={(value) =>
              setFormData({ ...formData, horarioId: value })
            }
            onTipoActividadChange={handleTipoActividadChange}
          />
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Datos de los participantes
            </h3>
            {formData.participantes.length > 5 && (
              <span className="text-xs text-default-500 ml-auto">
                {formData.participantes.length} participantes
              </span>
            )}
          </div>

          {/* Contenedor con scroll cuando hay más de 6 participantes */}
          <div
            className={
              formData.participantes.length > 6
                ? "max-h-[600px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
                : "space-y-4"
            }
          >
            {formData.participantes.map((p, index) => (
              <ParticipantCard
                key={index}
                index={index}
                participante={p}
                requiereTalle={requiereTalle}
                onParticipanteChange={handleParticipanteChange}
              />
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardBody className="p-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  isRequired
                  classNames={{
                    wrapper: "group-hover:bg-primary/20 mt-0.5",
                  }}
                  isDisabled={!hasReadTerms}
                  isSelected={formData.terminosAceptados}
                  onValueChange={(checked) =>
                    setFormData({ ...formData, terminosAceptados: checked })
                  }
                />
                <span className="text-sm pt-0.5">
                  Acepto los{" "}
                  <button
                    className="text-primary hover:text-primary-600 underline font-semibold transition-colors"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setTermsModalOpen(true);
                    }}
                  >
                    términos y condiciones
                  </button>{" "}
                  de la actividad *
                </span>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            className="w-full font-semibold shadow-lg"
            color="primary"
            isLoading={loading}
            size="lg"
            startContent={!loading && <CheckCircle2 className="w-5 h-5" />}
            type="submit"
          >
            {loading ? "Procesando..." : "Confirmar Inscripción"}
          </Button>
        </motion.div>
      </motion.form>

      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => {
          setTermsModalOpen(false);
          setHasReadTerms(true);
        }}
      />

      {confirmationData && (
        <ConfirmationModal
          isOpen={confirmModalOpen}
          data={confirmationData}
          isLoading={loading}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleConfirmSubmit}
        />
      )}
    </>
  );
};

export default EnrollmentForm;
