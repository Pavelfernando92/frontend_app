import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useUsersStore from "@/store/users.store";
import { AlertTriangle } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export interface CreditWarningModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>; // Cambiado aquí
  totalNeeded: number;
}

const CreditWarningModal: React.FC<CreditWarningModalProps> = ({
  showModal,
  setShowModal,
  totalNeeded,
}) => {
  const { user } = useUsersStore();
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="border-2 border-[#800020]">
        <DialogHeader>
          <DialogTitle className="text-[#800020] text-2xl font-bold flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            ¡Atención!
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-[#800020] text-lg">
          No tienes suficientes coins para jugar. Necesitas al menos{" "}
          {totalNeeded} coins.
        </DialogDescription>
        <div className="flex w-100 justify-center mt-4">
          <a
            href={`https://wa.me/5612175946?text=Hola,%20necesito%20más%20créditos%20para%20jugar%20mi%20correo%20es:%20${user?.email}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-96"
          >
            <Button
              variant="outline"
              className="mb-2 bg-[#800020] text-white hover:bg-[#600010] hover:text-yellow-200 w-full"
              onClick={() => setShowModal(false)} // Cambiado aquí
            >
              Solicitar Créditos
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditWarningModal;
