import { useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { CheckCircle2, ScrollText } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  const [hasReadAll, setHasReadAll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Resetear el estado cuando se abre el modal
    if (isOpen) {
      setHasReadAll(false);
    }
  }, [isOpen]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Verificar si el usuario ha llegado al final (con un margen de 5px)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      if (isAtBottom && !hasReadAll) {
        setHasReadAll(true);
      }
    }
  };

  return (
    <Modal
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2 items-center border-b">
              <ScrollText className="w-5 h-5 text-primary" />
              <span>Términos y Condiciones</span>
            </ModalHeader>
            <ModalBody className="py-6 max-h-[60vh] overflow-y-auto">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="space-y-4 text-sm overflow-y-auto max-h-full"
              >
                <section>
                  <h3 className="font-semibold text-lg mb-2">
                    1. Lorem Ipsum Dolor Sit
                  </h3>
                  <p className="text-default-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg mb-2">
                    2. Consectetur Adipiscing
                  </h3>
                  <p className="text-default-600 mb-2">
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-default-600 ml-4">
                    <li>
                      Sed ut perspiciatis unde omnis iste natus error sit
                      voluptatem
                    </li>
                    <li>Accusantium doloremque laudantium totam rem aperiam</li>
                    <li>
                      Eaque ipsa quae ab illo inventore veritatis et quasi
                      architecto
                    </li>
                    <li>Beatae vitae dicta sunt explicabo nemo enim ipsam</li>
                    <li>
                      Voluptatem quia voluptas sit aspernatur aut odit aut fugit
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg mb-2">
                    3. Quis Nostrud Exercitation
                  </h3>
                  <p className="text-default-600 mb-2">
                    Sed quia consequuntur magni dolores eos qui ratione
                    voluptatem sequi nesciunt:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-default-600 ml-4">
                    <li>
                      Neque porro quisquam est qui dolorem ipsum quia dolor sit
                      amet
                    </li>
                    <li>
                      Consectetur adipisci velit sed quia non numquam eius modi
                    </li>
                    <li>
                      Tempora incidunt ut labore et dolore magnam aliquam
                      quaerat
                    </li>
                    <li>
                      Ut enim ad minima veniam quis nostrum exercitationem ullam
                    </li>
                    <li>
                      Corporis suscipit laboriosam nisi ut aliquid ex ea commodi
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg mb-2">
                    4. Excepteur Sint Occaecat
                  </h3>
                  <p className="text-default-600">
                    At vero eos et accusamus et iusto odio dignissimos ducimus
                    qui blanditiis praesentium voluptatum deleniti atque
                    corrupti quos dolores et quas molestias excepturi sint
                    occaecati cupiditate non provident similique sunt in culpa
                    qui officia deserunt mollitia animi id est laborum et
                    dolorum fuga.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg mb-2">
                    5. Temporibus Autem Quibusdam
                  </h3>
                  <p className="text-default-600 mb-2">
                    Et harum quidem rerum facilis est et expedita distinctio:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-default-600 ml-4">
                    <li>
                      Nam libero tempore cum soluta nobis est eligendi optio
                    </li>
                    <li>
                      Cumque nihil impedit quo minus id quod maxime placeat
                    </li>
                    <li>
                      Facere possimus omnis voluptas assumenda est omnis dolor
                    </li>
                    <li>
                      Repellendus temporibus autem quibusdam et aut officiis
                    </li>
                    <li>
                      Debitis aut rerum necessitatibus saepe eveniet ut et
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg mb-2">
                    6. Itaque Earum Rerum
                  </h3>
                  <p className="text-default-600 mb-2">
                    Hic tenetur a sapiente delectus ut aut reiciendis
                    voluptatibus:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-default-600 ml-4">
                    <li>
                      Maiores alias consequatur aut perferendis doloribus
                      asperiores
                    </li>
                    <li>
                      Repellat hanc earum rerum hic tenetur a sapiente delectus
                    </li>
                    <li>
                      Ut aut reiciendis voluptatibus maiores alias consequatur
                    </li>
                    <li>
                      Aut perferendis doloribus asperiores repellat similique
                    </li>
                    <li>Sunt in culpa qui officia deserunt mollitia animi</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-lg mb-2">
                    7. Nemo Enim Ipsam
                  </h3>
                  <p className="text-default-600">
                    Quis autem vel eum iure reprehenderit qui in ea voluptate
                    velit esse quam nihil molestiae consequatur vel illum qui
                    dolorem eum fugiat quo voluptas nulla pariatur. Temporibus
                    autem quibusdam et aut officiis debitis aut rerum
                    necessitatibus saepe eveniet ut et voluptates repudiandae
                    sint et molestiae non recusandae.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg mb-2">
                    8. Voluptatem Accusantium
                  </h3>
                  <p className="text-default-600">
                    Itaque earum rerum hic tenetur a sapiente delectus ut aut
                    reiciendis voluptatibus maiores alias consequatur aut
                    perferendis doloribus asperiores repellat. On the other hand
                    we denounce with righteous indignation and dislike men who
                    are so beguiled and demoralized by the charms of pleasure of
                    the moment.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold text-lg mb-2">
                    9. Sed Ut Perspiciatis
                  </h3>
                  <p className="text-default-600">
                    But I must explain to you how all this mistaken idea of
                    denouncing pleasure and praising pain was born and I will
                    give you a complete account of the system and expound the
                    actual teachings of the great explorer of the truth, the
                    master-builder of human happiness.
                  </p>
                </section>

                <section className="pb-4">
                  <h3 className="font-semibold text-lg mb-2">
                    10. Finibus Bonorum et Malorum
                  </h3>
                  <p className="text-default-600">
                    No one rejects, dislikes, or avoids pleasure itself because
                    it is pleasure, but because those who do not know how to
                    pursue pleasure rationally encounter consequences that are
                    extremely painful. Nor again is there anyone who loves or
                    pursues or desires to obtain pain of itself.
                  </p>
                </section>

                {!hasReadAll && (
                  <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-4 text-center">
                    <p className="text-primary font-semibold text-sm animate-pulse">
                      ⬇ Por favor, desplácese hasta el final para continuar ⬇
                    </p>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="border-t">
              {hasReadAll ? (
                <div className="flex items-center gap-2 text-success text-sm mr-auto">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Has leído todos los términos</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-warning text-sm mr-auto">
                  <ScrollText className="w-4 h-4" />
                  <span>Debes leer todo el contenido</span>
                </div>
              )}
              <Button
                color="primary"
                isDisabled={!hasReadAll}
                startContent={<CheckCircle2 className="w-4 h-4" />}
                onPress={onClose}
              >
                Entendido
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TermsModal;
