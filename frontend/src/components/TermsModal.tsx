import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
        header: "border-b border-default-200",
        footer: "border-t border-default-200",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <span>Términos y Condiciones de la Actividad</span>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4 text-default-700">
            <section>
              <h3 className="text-lg font-semibold text-default-900 mb-2">
                1. Aceptación de los Términos
              </h3>
              <p className="text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-default-900 mb-2">
                2. Requisitos de Participación
              </h3>
              <p className="text-sm leading-relaxed mb-2">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit
                voluptatem accusantium doloremque laudantium, totam rem aperiam.
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 pl-4">
                <li>Eaque ipsa quae ab illo inventore veritatis et quasi architecto</li>
                <li>Beatae vitae dicta sunt explicabo nemo enim ipsam</li>
                <li>Voluptatem quia voluptas sit aspernatur aut odit aut fugit</li>
                <li>Sed quia consequuntur magni dolores eos qui ratione</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-default-900 mb-2">
                3. Normas de Seguridad
              </h3>
              <p className="text-sm leading-relaxed">
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-default-900 mb-2">
                4. Política de Cancelación
              </h3>
              <p className="text-sm leading-relaxed">
                Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit
                qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui
                dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto
                odio dignissimos ducimus qui blanditiis praesentium.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-default-900 mb-2">
                5. Responsabilidad y Riesgos
              </h3>
              <p className="text-sm leading-relaxed mb-2">
                Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
                occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                mollitia animi, id est laborum et dolorum fuga.
              </p>
              <p className="text-sm leading-relaxed">
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum
                soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime
                placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-default-900 mb-2">
                6. Uso de Equipamiento
              </h3>
              <p className="text-sm leading-relaxed">
                Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe
                eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque
                earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus
                maiores alias consequatur aut perferendis doloribus asperiores repellat.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-default-900 mb-2">
                7. Protección de Datos Personales
              </h3>
              <p className="text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
                gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Consectetur
                adipiscing elit duis tristique sollicitudin nibh sit amet commodo.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-default-900 mb-2">
                8. Modificaciones a los Términos
              </h3>
              <p className="text-sm leading-relaxed">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
                voluptatem quia voluptas sit aspernatur aut odit aut fugit.
              </p>
            </section>

            <section className="bg-warning-50 border-l-4 border-warning-500 p-4 rounded-r">
              <h3 className="text-lg font-semibold text-warning-900 mb-2">
                Aviso Importante
              </h3>
              <p className="text-sm leading-relaxed text-warning-800">
                Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                dolore magnam aliquam quaerat voluptatem.
              </p>
            </section>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onPress={onClose}
            className="font-semibold"
          >
            Entendido
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TermsModal;

