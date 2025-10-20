import type { Participante } from "../../types";

import { motion } from "framer-motion";
import { Card, CardBody, Input, Select, SelectItem } from "@heroui/react";
import { Cake, CreditCard, Shirt, User } from "lucide-react";

interface ParticipantCardProps {
  index: number;
  participante: Participante;
  requiereTalle: boolean;
  onParticipanteChange: (
    index: number,
    field: keyof Participante,
    value: string,
  ) => void;
}

export const ParticipantCard = ({
  index,
  participante,
  requiereTalle,
  onParticipanteChange,
}: ParticipantCardProps) => {
  // Validaciones
  const validateNombre = (nombre: string) => {
    if (!nombre) return "El nombre es requerido";
    if (nombre.length < 3) return "El nombre debe tener al menos 3 caracteres";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre))
      return "El nombre solo puede contener letras";

    return "";
  };

  const validateDni = (dni: string) => {
    if (!dni) return "El DNI es requerido";
    if (!/^\d+$/.test(dni)) return "El DNI solo puede contener números";
    if (dni.length < 7 || dni.length > 8)
      return "El DNI debe tener entre 7 y 8 dígitos";

    return "";
  };

  const validateEdad = (edad: string) => {
    if (!edad) return "La edad es requerida";
    const edadNum = parseInt(edad);

    if (isNaN(edadNum)) return "La edad debe ser un número";
    if (edadNum < 1 || edadNum > 120)
      return "La edad debe estar entre 1 y 120 años";

    return "";
  };

  const nombreError = participante.nombre
    ? validateNombre(participante.nombre)
    : "";
  const dniError = participante.dni ? validateDni(participante.dni) : "";
  const edadError = participante.edad ? validateEdad(participante.edad) : "";

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.95 }}
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
              isRequired
              classNames={{
                inputWrapper:
                  "bg-default-100 border-2 border-default-200 hover:bg-default-200",
              }}
              errorMessage={nombreError}
              isInvalid={!!nombreError}
              label="Nombre completo"
              placeholder="Ej: Juan Pérez"
              startContent={<User className="w-4 h-4 text-default-400" />}
              type="text"
              value={participante.nombre}
              onValueChange={(value) =>
                onParticipanteChange(index, "nombre", value)
              }
            />

            <Input
              isRequired
              classNames={{
                inputWrapper:
                  "bg-default-100 border-2 border-default-200 hover:bg-default-200",
              }}
              errorMessage={dniError}
              isInvalid={!!dniError}
              label="DNI"
              maxLength={8}
              placeholder="Ej: 12345678"
              startContent={<CreditCard className="w-4 h-4 text-default-400" />}
              type="text"
              value={participante.dni}
              onValueChange={(value) => {
                // Solo permitir números y limitar a 8 caracteres
                const onlyNumbers = value.replace(/\D/g, "");

                if (onlyNumbers.length <= 8) {
                  onParticipanteChange(index, "dni", onlyNumbers);
                }
              }}
            />

            <Input
              isRequired
              classNames={{
                inputWrapper:
                  "bg-default-100 border-2 border-default-200 hover:bg-default-200",
              }}
              errorMessage={edadError}
              isInvalid={!!edadError}
              label="Edad"
              max="120"
              min="1"
              placeholder="Ej: 25"
              startContent={<Cake className="w-4 h-4 text-default-400" />}
              type="number"
              value={participante.edad}
              onValueChange={(value) =>
                onParticipanteChange(index, "edad", value)
              }
            />

            {requiereTalle && (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
              >
                <Select
                  isRequired
                  classNames={{
                    trigger:
                      "bg-default-100 border-2 border-default-200 hover:bg-default-200",
                  }}
                  label="Talla de vestimenta"
                  placeholder="Seleccione una talla"
                  selectedKeys={participante.talla ? [participante.talla] : []}
                  startContent={<Shirt className="w-4 h-4 text-default-400" />}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    onParticipanteChange(index, "talla", selected);
                  }}
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
  );
};
