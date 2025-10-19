import { motion } from "framer-motion";
import { Input, Select, SelectItem, Card, CardBody } from "@heroui/react";
import { User, CreditCard, Cake, Shirt } from "lucide-react";
import type { Participante } from "../../types";

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

  const nombreError = participante.nombre ? validateNombre(participante.nombre) : "";
  const dniError = participante.dni ? validateDni(participante.dni) : "";
  const edadError = participante.edad ? validateEdad(participante.edad) : "";

  return (
    <motion.div
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
              value={participante.nombre}
              onValueChange={(value) =>
                onParticipanteChange(index, "nombre", value)
              }
              classNames={{
                inputWrapper:
                  "bg-default-100 border-2 border-default-200 hover:bg-default-200",
              }}
              startContent={<User className="w-4 h-4 text-default-400" />}
              isInvalid={!!nombreError}
              errorMessage={nombreError}
            />

            <Input
              type="text"
              label="DNI"
              placeholder="Ej: 12345678"
              isRequired
              value={participante.dni}
              onValueChange={(value) => {
                // Solo permitir números y limitar a 8 caracteres
                const onlyNumbers = value.replace(/\D/g, "");
                if (onlyNumbers.length <= 8) {
                  onParticipanteChange(index, "dni", onlyNumbers);
                }
              }}
              classNames={{
                inputWrapper:
                  "bg-default-100 border-2 border-default-200 hover:bg-default-200",
              }}
              startContent={<CreditCard className="w-4 h-4 text-default-400" />}
              isInvalid={!!dniError}
              errorMessage={dniError}
              maxLength={8}
            />

            <Input
              type="number"
              label="Edad"
              placeholder="Ej: 25"
              isRequired
              min="1"
              max="120"
              value={participante.edad}
              onValueChange={(value) =>
                onParticipanteChange(index, "edad", value)
              }
              classNames={{
                inputWrapper:
                  "bg-default-100 border-2 border-default-200 hover:bg-default-200",
              }}
              startContent={<Cake className="w-4 h-4 text-default-400" />}
              isInvalid={!!edadError}
              errorMessage={edadError}
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
                  selectedKeys={participante.talla ? [participante.talla] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    onParticipanteChange(index, "talla", selected);
                  }}
                  classNames={{
                    trigger:
                      "bg-default-100 border-2 border-default-200 hover:bg-default-200",
                  }}
                  startContent={<Shirt className="w-4 h-4 text-default-400" />}
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
