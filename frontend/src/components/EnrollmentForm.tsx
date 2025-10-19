import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Input,
  Select,
  SelectItem,
  Button,
  Card,
  CardBody,
  Checkbox,
  Avatar,
  Chip,
} from "@heroui/react";
import {
  Calendar,
  Users,
  AlertCircle,
  CheckCircle2,
  User,
  CreditCard,
  Cake,
  Shirt,
  Clock,
  MapPin,
  UserCheck,
} from "lucide-react";
import TermsModal from "./TermsModal";

// Importar las imágenes
import safariImg from "../assets/zafari.png";
import tirolesaImg from "../assets/tirolesa.png";
import jardineriaImg from "../assets/jardineria.png";
import palestraImg from "../assets/palestra.png";

const API_URL = "http://localhost:3000/api";

// Función para obtener el avatar según el nombre o código de la actividad
const getActivityAvatar = (activityName: string, codigo?: string): string => {
  const name = activityName.toLowerCase();
  const code = (codigo || "").toLowerCase();

  if (code === "safari" || name.includes("safari") || name.includes("zafari"))
    return safariImg;
  if (code === "tirolesa" || name.includes("tirolesa")) return tirolesaImg;
  if (code === "jardineria" || name.includes("jardiner")) return jardineriaImg;
  if (code === "palestra" || name.includes("palestra")) return palestraImg;
  return ""; // default
};

// Función para formatear fecha y hora
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const timeStr = date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { dateStr, timeStr };
};

interface Participante {
  nombre: string;
  dni: string;
  edad: string;
  talla: string;
}

interface TipoActividad {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  requiere_talla: number;
  cupos: number;
  tipo_id: number;
  tipo_nombre: string;
  tipo_codigo: string;
}

interface FormData {
  tipoActividad: string;
  actividad: string;
  horarioId: string;
  cantidadPersonas: number;
  participantes: Participante[];
  terminosAceptados: boolean;
}

interface EnrollmentFormProps {
  onSuccess: (code: string) => void;
}

const EnrollmentForm = ({ onSuccess }: EnrollmentFormProps) => {
  const [tiposActividades, setTiposActividades] = useState<TipoActividad[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsModalOpen, setTermsModalOpen] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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
        if (requiereTalle && !p.talla) {
          throw new Error(`Debe indicar la talla del participante ${i + 1}`);
        }
      }

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
    } finally {
      setLoading(false);
    }
  };

  // Verificar si la actividad seleccionada requiere talla
  const actividadSeleccionada = actividades.find(
    (act) => act.id.toString() === formData.actividad,
  );
  const requiereTalle = actividadSeleccionada?.requiere_talla === 1;

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
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-danger-50 border-l-4 border-danger-500 p-4 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
            <p className="text-danger-700 text-sm">{error}</p>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">
                  Selecciona tu actividad
                </h3>
              </div>

              <div className="space-y-4">
                <Select
                  label="Tipo de Actividad"
                  placeholder="Seleccione un tipo de actividad"
                  isRequired
                  selectedKeys={
                    formData.tipoActividad ? [formData.tipoActividad] : []
                  }
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    handleTipoActividadChange(selected);
                  }}
                  classNames={{
                    trigger:
                      "bg-default-100 border-2 border-default-200 hover:bg-default-200 min-h-[60px]",
                    value: "text-base",
                  }}
                  renderValue={(items) => {
                    return items.map((item) => {
                      const tipo = tiposActividades.find(
                        (t) => t.id.toString() === item.key,
                      );
                      return (
                        <div key={item.key} className="flex items-center gap-2">
                          <Avatar
                            src={getActivityAvatar(
                              tipo?.nombre || "",
                              tipo?.codigo,
                            )}
                            className="w-6 h-6"
                            size="sm"
                          />
                          <span className="font-semibold text-sm">
                            {tipo?.nombre}
                          </span>
                        </div>
                      );
                    });
                  }}
                >
                  {tiposActividades.map((tipo) => (
                    <SelectItem
                      key={tipo.id.toString()}
                      textValue={tipo.nombre}
                      classNames={{
                        base: "py-3",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={getActivityAvatar(tipo.nombre, tipo.codigo)}
                          className="w-10 h-10 flex-shrink-0"
                          size="md"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-base">
                            {tipo.nombre}
                          </span>
                          <span className="text-xs text-default-500">
                            {tipo.descripcion}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </Select>

                {formData.tipoActividad && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Select
                      label="Actividad"
                      placeholder="Seleccione una actividad"
                      isRequired
                      isDisabled={loading || actividades.length === 0}
                      selectedKeys={
                        formData.actividad ? [formData.actividad] : []
                      }
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        handleActividadChange(selected);
                      }}
                      classNames={{
                        trigger:
                          "bg-default-100 border-2 border-default-200 hover:bg-default-200 min-h-[60px]",
                        value: "text-base",
                      }}
                      description={
                        actividades.length === 0 && !loading
                          ? "No hay actividades disponibles para este tipo"
                          : ""
                      }
                      renderValue={(items) => {
                        return items.map((item) => {
                          const act = actividades.find(
                            (a) => a.id.toString() === item.key,
                          );
                          return (
                            <div
                              key={item.key}
                              className="flex items-center gap-2"
                            >
                              <Avatar
                                src={getActivityAvatar(
                                  act?.tipo_nombre || "",
                                  act?.tipo_codigo,
                                )}
                                className="w-6 h-6"
                                size="sm"
                              />
                              <span className="font-semibold text-sm">
                                {act?.nombre}
                              </span>
                            </div>
                          );
                        });
                      }}
                    >
                      {actividades.map((act) => (
                        <SelectItem
                          key={act.id.toString()}
                          textValue={act.nombre}
                          classNames={{
                            base: "py-3",
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar
                              src={getActivityAvatar(
                                act.tipo_nombre,
                                act.tipo_codigo,
                              )}
                              className="w-10 h-10 flex-shrink-0 mt-1"
                              size="md"
                            />
                            <div className="flex flex-col flex-1">
                              <span className="font-semibold text-base">
                                {act.nombre}
                              </span>
                              <span className="text-xs text-default-500 mb-2">
                                {act.descripcion}
                              </span>
                              <div className="flex items-center gap-2">
                                <Chip size="sm" variant="flat" color="success">
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {act.cupos} cupos
                                  </div>
                                </Chip>
                                {act.requiere_talla === 1 && (
                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    color="warning"
                                  >
                                    <div className="flex items-center gap-1">
                                      <Shirt className="w-3 h-3" />
                                      Requiere talla
                                    </div>
                                  </Chip>
                                )}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  </motion.div>
                )}

                {formData.actividad && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Select
                      label="Horario"
                      placeholder="Seleccione un horario"
                      isRequired
                      isDisabled={loading || horarios.length === 0}
                      selectedKeys={
                        formData.horarioId ? [formData.horarioId] : []
                      }
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setFormData({ ...formData, horarioId: selected });
                      }}
                      classNames={{
                        trigger:
                          "bg-default-100 border-2 border-default-200 hover:bg-default-200 min-h-[60px]",
                        value: "text-base",
                      }}
                      description={
                        horarios.length === 0 && !loading
                          ? "No hay horarios disponibles para esta actividad"
                          : ""
                      }
                      renderValue={(items) => {
                        return items.map((item) => {
                          const horario = horarios.find(
                            (h) => h.id_horario.toString() === item.key,
                          );
                          if (!horario) return null;
                          const { dateStr, timeStr } = formatDateTime(
                            horario.fecha_inicio,
                          );
                          const { timeStr: timeEndStr } = formatDateTime(
                            horario.fecha_fin,
                          );
                          return (
                            <div
                              key={item.key}
                              className="flex items-center gap-2"
                            >
                              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm capitalize">
                                  {dateStr}
                                </span>
                                <span className="text-xs text-default-500">
                                  {timeStr} - {timeEndStr}
                                </span>
                              </div>
                            </div>
                          );
                        });
                      }}
                    >
                      {horarios.map((h) => {
                        const { dateStr, timeStr } = formatDateTime(
                          h.fecha_inicio,
                        );
                        const { timeStr: timeEndStr } = formatDateTime(
                          h.fecha_fin,
                        );
                        const cuposOcupados =
                          h.cupos_horario - h.cupos_disponibles;
                        const porcentajeOcupado =
                          (cuposOcupados / h.cupos_horario) * 100;

                        return (
                          <SelectItem
                            key={h.id_horario.toString()}
                            textValue={`${dateStr} ${timeStr}`}
                            classNames={{
                              base: "py-4",
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-6 h-6 text-primary" />
                              </div>
                              <div className="flex flex-col flex-1 gap-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className="font-semibold text-base capitalize block">
                                      {dateStr}
                                    </span>
                                    <div className="flex items-center gap-1 text-sm text-default-600 mt-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>
                                        {timeStr} - {timeEndStr}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    color={
                                      h.cupos_disponibles > 10
                                        ? "success"
                                        : h.cupos_disponibles > 5
                                          ? "warning"
                                          : "danger"
                                    }
                                  >
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      {h.cupos_disponibles}/{h.cupos_horario}{" "}
                                      disponibles
                                    </div>
                                  </Chip>

                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                  >
                                    <div className="flex items-center gap-1">
                                      <UserCheck className="w-3 h-3" />
                                      {h.cuidador_nombre}
                                    </div>
                                  </Chip>
                                </div>

                                {/* Barra de progreso de cupos */}
                                <div className="w-full bg-default-200 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${
                                      porcentajeOcupado < 50
                                        ? "bg-success"
                                        : porcentajeOcupado < 80
                                          ? "bg-warning"
                                          : "bg-danger"
                                    }`}
                                    style={{ width: `${porcentajeOcupado}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </Select>
                  </motion.div>
                )}

                <Input
                  type="number"
                  label="Cantidad de personas"
                  placeholder="1"
                  isRequired
                  min="1"
                  max="10"
                  value={formData.cantidadPersonas.toString()}
                  onValueChange={handleCantidadChange}
                  classNames={{
                    inputWrapper:
                      "bg-default-100 border-2 border-default-200 hover:bg-default-200",
                  }}
                  startContent={<Users className="w-4 h-4 text-default-400" />}
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">
              Datos de los participantes
            </h3>
          </div>

          {formData.participantes.map((p, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardBody className="p-6 space-y-4">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                    Participante {index + 1}
                  </h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      label="Nombre completo"
                      placeholder="Ej: Juan Pérez"
                      isRequired
                      value={p.nombre}
                      onValueChange={(value) =>
                        handleParticipanteChange(index, "nombre", value)
                      }
                      classNames={{
                        inputWrapper:
                          "bg-default-100 border-2 border-default-200 hover:bg-default-200",
                      }}
                      startContent={
                        <User className="w-4 h-4 text-default-400" />
                      }
                    />

                    <Input
                      type="text"
                      label="DNI"
                      placeholder="Ej: 12345678"
                      isRequired
                      value={p.dni}
                      onValueChange={(value) =>
                        handleParticipanteChange(index, "dni", value)
                      }
                      classNames={{
                        inputWrapper:
                          "bg-default-100 border-2 border-default-200 hover:bg-default-200",
                      }}
                      startContent={
                        <CreditCard className="w-4 h-4 text-default-400" />
                      }
                    />

                    <Input
                      type="number"
                      label="Edad"
                      placeholder="Ej: 25"
                      isRequired
                      min="1"
                      max="120"
                      value={p.edad}
                      onValueChange={(value) =>
                        handleParticipanteChange(index, "edad", value)
                      }
                      classNames={{
                        inputWrapper:
                          "bg-default-100 border-2 border-default-200 hover:bg-default-200",
                      }}
                      startContent={
                        <Cake className="w-4 h-4 text-default-400" />
                      }
                    />

                    {requiereTalle && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Select
                          label="Talla de vestimenta"
                          placeholder="Seleccione una talla"
                          isRequired
                          selectedKeys={p.talla ? [p.talla] : []}
                          onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as string;
                            handleParticipanteChange(index, "talla", selected);
                          }}
                          classNames={{
                            trigger:
                              "bg-default-100 border-2 border-default-200 hover:bg-default-200",
                          }}
                          startContent={
                            <Shirt className="w-4 h-4 text-default-400" />
                          }
                        >
                          <SelectItem key="XS">XS</SelectItem>
                          <SelectItem key="S">S</SelectItem>
                          <SelectItem key="M">M</SelectItem>
                          <SelectItem key="L">L</SelectItem>
                          <SelectItem key="XL">XL</SelectItem>
                          <SelectItem key="XXL">XXL</SelectItem>
                        </Select>
                      </motion.div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md">
            <CardBody className="p-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  isRequired
                  isSelected={formData.terminosAceptados}
                  onValueChange={(checked) =>
                    setFormData({ ...formData, terminosAceptados: checked })
                  }
                  classNames={{
                    wrapper: "group-hover:bg-primary/20 mt-0.5",
                  }}
                  isDisabled={!hasReadTerms}
                />
                <span className="text-sm pt-0.5">
                  Acepto los{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setTermsModalOpen(true);
                    }}
                    className="text-primary hover:text-primary-600 underline font-semibold transition-colors"
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
            type="submit"
            isLoading={loading}
            color="primary"
            size="lg"
            className="w-full font-semibold shadow-lg"
            startContent={!loading && <CheckCircle2 className="w-5 h-5" />}
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
    </>
  );
};

export default EnrollmentForm;
