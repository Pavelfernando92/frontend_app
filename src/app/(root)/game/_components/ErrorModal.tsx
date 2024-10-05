import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ErrorModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ErrorModal({ message, isOpen, onClose }: ErrorModalProps) {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-red-800 text-white rounded-lg shadow-lg border border-red-600">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Error</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <p className="text-lg">{message}</p>
        </div>
        <div className="flex justify-end p-4">
          <Button
            onClick={handleClose}
            variant="secondary"
            className="bg-red-600 text-white hover:bg-red-500 transition duration-200"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
