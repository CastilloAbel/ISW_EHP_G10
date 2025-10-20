import type { TipoActividad, Actividad } from "@/types";

import { motion } from "framer-motion";
import {
  Select,
  SelectItem,
  Input,
  Card,
  CardBody,
  Avatar,
  Chip,
} from "@heroui/react";
import { Calendar, Users, Clock, UserCheck, Shirt } from "lucide-react";

import { getActivityAvatar, formatDateTime } from "@/utils/activityHelpers.ts";

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
            isRequired
            classNames={{
              trigger:
                "bg-default-100 border-2 border-default-200 hover:bg-default-200 min-h-[60px]",
              value: "text-base",
            }}
            label="Tipo de Actividad"
            placeholder="Seleccione un tipo de actividad"
            renderValue={(items) => {
              return items.map((item) => {
                const tipo = tiposActividades.find(
                  (t) => t.id.toString() === item.key,
                );

                return (
                  <div key={item.key} className="flex items-center gap-2">
                    <Avatar
                      className="w-6 h-6"
                      size="sm"
                      src={getActivityAvatar(tipo?.nombre || "", tipo?.codigo)}
                    />
                    <span className="font-semibold text-sm">
                      {tipo?.nombre}
                    </span>
                  </div>
                );
              });
            }}
            selectedKeys={selectedTipoActividad ? [selectedTipoActividad] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;

              onTipoActividadChange(selected);
            }}
          >
            {tiposActividades.map((tipo) => (
              <SelectItem
                key={tipo.id.toString()}
                classNames={{ base: "py-3" }}
                textValue={tipo.nombre}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    className="w-10 h-10 flex-shrink-0"
                    size="md"
                    src={getActivityAvatar(tipo.nombre, tipo.codigo)}
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

          {selectedTipoActividad && (
            <motion.div
              animate={{ opacity: 1, height: "auto" }}
              initial={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Select
                isRequired
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
                isDisabled={loading || actividades.length === 0}
                label="Actividad"
                placeholder="Seleccione una actividad"
                renderValue={(items) => {
                  return items.map((item) => {
                    const act = actividades.find(
                      (a) => a.id.toString() === item.key,
                    );

                    return (
                      <div key={item.key} className="flex items-center gap-2">
                        <Avatar
                          className="w-6 h-6"
                          size="sm"
                          src={getActivityAvatar(
                            act?.tipo_nombre || "",
                            act?.tipo_codigo,
                          )}
                        />
                        <span className="font-semibold text-sm">
                          {act?.nombre}
                        </span>
                      </div>
                    );
                  });
                }}
                selectedKeys={selectedActividad ? [selectedActividad] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;

                  onActividadChange(selected);
                }}
              >
                {actividades.map((act) => (
                  <SelectItem
                    key={act.id.toString()}
                    classNames={{ base: "py-3" }}
                    textValue={act.nombre}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        className="w-10 h-10 flex-shrink-0 mt-1"
                        size="md"
                        src={getActivityAvatar(
                          act.tipo_nombre,
                          act.tipo_codigo,
                        )}
                      />
                      <div className="flex flex-col flex-1">
                        <span className="font-semibold text-base">
                          {act.nombre}
                        </span>
                        <span className="text-xs text-default-500 mb-2">
                          {act.descripcion}
                        </span>
                        <div className="flex items-center gap-2">
                          {act.requiere_talla === 1 && (
                            <Chip color="warning" size="sm" variant="flat">
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
              animate={{ opacity: 1, height: "auto" }}
              initial={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Select
                isRequired
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
                isDisabled={loading || horarios.length === 0}
                label="Horario"
                placeholder="Seleccione un horario"
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
                selectedKeys={selectedHorarioId ? [selectedHorarioId] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;

                  onHorarioChange(selected);
                }}
              >
                {horarios.map((h) => {
                  const { dateStr, timeStr } = formatDateTime(h.fecha_inicio);
                  const { timeStr: timeEndStr } = formatDateTime(h.fecha_fin);
                  const cuposOcupados = h.cupos_horario - h.cupos_disponibles;
                  const porcentajeOcupado =
                    (cuposOcupados / h.cupos_horario) * 100;

                  return (
                    <SelectItem
                      key={h.id_horario.toString()}
                      classNames={{ base: "py-4" }}
                      textValue={`${dateStr} ${timeStr}`}
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
                              color={
                                h.cupos_disponibles > 10
                                  ? "success"
                                  : h.cupos_disponibles > 5
                                    ? "warning"
                                    : "danger"
                              }
                              size="sm"
                              variant="flat"
                            >
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {h.cupos_disponibles}/{h.cupos_horario}{" "}
                                disponibles
                              </div>
                            </Chip>

                            <Chip color="primary" size="sm" variant="flat">
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
            isRequired
            classNames={{
              inputWrapper:
                "bg-default-100 border-2 border-default-200 hover:bg-default-200",
            }}
            description="Máximo 20 participantes por inscripción"
            label="Cantidad de personas"
            max="20"
            min="1"
            placeholder="1"
            startContent={<Users className="w-4 h-4 text-default-400" />}
            type="number"
            value={cantidadPersonas.toString()}
            onValueChange={onCantidadChange}
          />
        </div>
      </CardBody>
    </Card>
  );
};
