import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Divider,
  Chip,
} from "@heroui/react";
import {
  Calendar,
  Clock,
  Users,
  User,
  CreditCard,
  Cake,
  Shirt,
  MapPin,
  CheckCircle2,
} from "lucide-react";

interface Participante {
  nombre: string;
  dni: string;
  edad: string;
  talla: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  data: {
    tipoActividad: string;
    actividad: string;
    horario: {
      fecha: string;
      horaInicio: string;
      horaFin: string;
      cuidador: string;
      cuposDisponibles: number;
    } | null;
    participantes: Participante[];
    requiereTalle: boolean;
  };
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  data,
}: ConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      size="2xl"
      scrollBehavior="inside"
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">
                  Confirmar Inscripción
                </span>
              </div>
              <p className="text-sm font-normal text-default-500">
                Por favor, revisa los datos antes de confirmar
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {/* Información de la actividad */}
                <Card className="shadow-sm">
                  <CardBody className="space-y-3">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Información de la Actividad
                    </h3>
                    <Divider />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-default-600">
                          Tipo de Actividad:
                        </span>
                        <span className="font-semibold">
                          {data.tipoActividad}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-default-600">
                          Actividad:
                        </span>
                        <span className="font-semibold">{data.actividad}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Información del horario */}
                {data.horario && (
                  <Card className="shadow-sm">
                    <CardBody className="space-y-3">
                      <h3 className="font-semibold text-primary flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Horario Seleccionado
                      </h3>
                      <Divider />
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-default-600 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Fecha:
                          </span>
                          <span className="font-semibold capitalize">
                            {data.horario.fecha}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-default-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Horario:
                          </span>
                          <span className="font-semibold">
                            {data.horario.horaInicio} - {data.horario.horaFin}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-default-600 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Cuidador:
                          </span>
                          <span className="font-semibold">
                            {data.horario.cuidador}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-default-600 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Cupos disponibles:
                          </span>
                          <Chip
                            color={
                              data.horario.cuposDisponibles > 10
                                ? "success"
                                : data.horario.cuposDisponibles > 5
                                  ? "warning"
                                  : "danger"
                            }
                            size="sm"
                            variant="flat"
                          >
                            {data.horario.cuposDisponibles}
                          </Chip>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* Información de los participantes */}
                <Card className="shadow-sm">
                  <CardBody className="space-y-3">
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Participantes ({data.participantes.length})
                    </h3>
                    <Divider />
                    <div className="space-y-4">
                      {data.participantes.map((participante, index) => (
                        <div
                          key={index}
                          className="bg-default-100 p-3 rounded-lg space-y-2"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                              {index + 1}
                            </div>
                            <span className="font-semibold text-sm">
                              Participante {index + 1}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-default-500" />
                              <span className="text-default-600">Nombre:</span>
                            </div>
                            <span className="font-medium text-right">
                              {participante.nombre}
                            </span>

                            <div className="flex items-center gap-2">
                              <CreditCard className="w-3.5 h-3.5 text-default-500" />
                              <span className="text-default-600">DNI:</span>
                            </div>
                            <span className="font-medium text-right">
                              {participante.dni}
                            </span>

                            <div className="flex items-center gap-2">
                              <Cake className="w-3.5 h-3.5 text-default-500" />
                              <span className="text-default-600">Edad:</span>
                            </div>
                            <span className="font-medium text-right">
                              {participante.edad} años
                            </span>

                            {data.requiereTalle && participante.talla && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Shirt className="w-3.5 h-3.5 text-default-500" />
                                  <span className="text-default-600">
                                    Talla:
                                  </span>
                                </div>
                                <span className="font-medium text-right">
                                  {participante.talla}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Aviso importante */}
                <div className="bg-warning-50 border-l-4 border-warning p-3 rounded-lg">
                  <p className="text-sm text-warning-800">
                    <strong>Importante:</strong> Verifica que todos los datos
                    sean correctos antes de confirmar. Una vez confirmada la
                    inscripción, recibirás un código de reserva.
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                isDisabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                startContent={
                  !isLoading && <CheckCircle2 className="w-4 h-4" />
                }
                onPress={onConfirm}
              >
                {isLoading ? "Procesando..." : "Confirmar Inscripción"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;

