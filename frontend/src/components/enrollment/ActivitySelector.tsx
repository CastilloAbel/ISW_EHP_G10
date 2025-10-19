import { motion } from "framer-motion";
import { Select, SelectItem, Input, Card, CardBody, Avatar, Chip } from "@heroui/react";
import { Calendar, Users, Clock, UserCheck, Shirt } from "lucide-react";
import { getActivityAvatar, formatDateTime } from "../../utils/activityHelpers";
import type { TipoActividad, Actividad } from "../../types";

interface ActivitySelectorProps {
  tiposActividades: TipoActividad[];
  actividades: Actividad[];
  horarios: any[];
  loading: boolean;
  selectedTipoActividad: string;
  selectedActividad: string;
  selectedHorarioId: string;
  cantidadPersonas: number;
  onTipoActividadChange: (value: string) => void;
  onActividadChange: (value: string) => void;
  onHorarioChange: (value: string) => void;
  onCantidadChange: (value: string) => void;
}

export const ActivitySelector = ({
  tiposActividades,
  actividades,
  horarios,
  loading,
  selectedTipoActividad,
  selectedActividad,
  selectedHorarioId,
  cantidadPersonas,
  onTipoActividadChange,
  onActividadChange,
  onHorarioChange,
  onCantidadChange,
}: ActivitySelectorProps) => {
  return (
    <Card className="shadow-lg">
      <CardBody className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Selecciona tu actividad</h3>
        </div>

        <div className="space-y-4">
          <Select
            label="Tipo de Actividad"
            placeholder="Seleccione un tipo de actividad"
            isRequired
            selectedKeys={selectedTipoActividad ? [selectedTipoActividad] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              onTipoActividadChange(selected);
            }}
            classNames={{
              trigger:
                "bg-default-100 border-2 border-default-200 hover:bg-default-200 min-h-[60px]",
              value: "text-base",
            }}
            renderValue={(items) => {
              return items.map((item) => {
                const tipo = tiposActividades.find(
                  (t) => t.id.toString() === item.key
                );
                return (
                  <div key={item.key} className="flex items-center gap-2">
                    <Avatar
                      src={getActivityAvatar(tipo?.nombre || "", tipo?.codigo)}
                      className="w-6 h-6"
                      size="sm"
                    />
                    <span className="font-semibold text-sm">{tipo?.nombre}</span>
                  </div>
                );
              });
            }}
          >
            {tiposActividades.map((tipo) => (
              <SelectItem
                key={tipo.id.toString()}
                textValue={tipo.nombre}
                classNames={{ base: "py-3" }}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={getActivityAvatar(tipo.nombre, tipo.codigo)}
                    className="w-10 h-10 flex-shrink-0"
                    size="md"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-base">{tipo.nombre}</span>
                    <span className="text-xs text-default-500">
                      {tipo.descripcion}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </Select>

          {selectedTipoActividad && (
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
                selectedKeys={selectedActividad ? [selectedActividad] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  onActividadChange(selected);
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
                    const act = actividades.find((a) => a.id.toString() === item.key);
                    return (
                      <div key={item.key} className="flex items-center gap-2">
                        <Avatar
                          src={getActivityAvatar(
                            act?.tipo_nombre || "",
                            act?.tipo_codigo
                          )}
                          className="w-6 h-6"
                          size="sm"
                        />
                        <span className="font-semibold text-sm">{act?.nombre}</span>
                      </div>
                    );
                  });
                }}
              >
                {actividades.map((act) => (
                  <SelectItem
                    key={act.id.toString()}
                    textValue={act.nombre}
                    classNames={{ base: "py-3" }}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        src={getActivityAvatar(act.tipo_nombre, act.tipo_codigo)}
                        className="w-10 h-10 flex-shrink-0 mt-1"
                        size="md"
                      />
                      <div className="flex flex-col flex-1">
                        <span className="font-semibold text-base">{act.nombre}</span>
                        <span className="text-xs text-default-500 mb-2">
                          {act.descripcion}
                        </span>
                        <div className="flex items-center gap-2">
                          {act.requiere_talla === 1 && (
                            <Chip size="sm" variant="flat" color="warning">
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

          {selectedActividad && (
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
                selectedKeys={selectedHorarioId ? [selectedHorarioId] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  onHorarioChange(selected);
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
                      (h) => h.id_horario.toString() === item.key
                    );
                    if (!horario) return null;
                    const { dateStr, timeStr } = formatDateTime(horario.fecha_inicio);
                    const { timeStr: timeEndStr } = formatDateTime(horario.fecha_fin);
                    return (
                      <div key={item.key} className="flex items-center gap-2">
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
                  const { dateStr, timeStr } = formatDateTime(h.fecha_inicio);
                  const { timeStr: timeEndStr } = formatDateTime(h.fecha_fin);
                  const cuposOcupados = h.cupos_horario - h.cupos_disponibles;
                  const porcentajeOcupado = (cuposOcupados / h.cupos_horario) * 100;

                  return (
                    <SelectItem
                      key={h.id_horario.toString()}
                      textValue={`${dateStr} ${timeStr}`}
                      classNames={{ base: "py-4" }}
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
                                {h.cupos_disponibles}/{h.cupos_horario} disponibles
                              </div>
                            </Chip>

                            <Chip size="sm" variant="flat" color="primary">
                              <div className="flex items-center gap-1">
                                <UserCheck className="w-3 h-3" />
                                {h.cuidador_nombre}
                              </div>
                            </Chip>
                          </div>

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
            value={cantidadPersonas.toString()}
            onValueChange={onCantidadChange}
            classNames={{
              inputWrapper:
                "bg-default-100 border-2 border-default-200 hover:bg-default-200",
            }}
            startContent={<Users className="w-4 h-4 text-default-400" />}
          />
        </div>
      </CardBody>
    </Card>
  );
};

