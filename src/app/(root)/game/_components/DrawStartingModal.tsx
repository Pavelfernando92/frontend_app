"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DrawStartingModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeRemaining: number | null; // Recibiendo el tiempo restante
}

export default function DrawStartingModal({
  isOpen,
  onClose,
  timeRemaining, // Recibiendo el tiempo restante
}: DrawStartingModalProps) {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reiniciar el countdown si el modal se abre
      setCountdown(timeRemaining);
    }
  }, [isOpen, timeRemaining]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(
        () => setCountdown((prev) => (prev ? prev - 1 : 0)),
        1000
      );
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onClose(); // Cierra el modal cuando el countdown llegue a 0
    }
  }, [countdown, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#800020] to-[#4d0013] text-white border-[#800020]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-[#ffd700]">
            ¡La sala está completa!
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-6">
          <p className="text-lg text-center text-[#f0e68c]">
            El sorteo comenzará en breve. Prepárate para la emoción.
          </p>
          <div className="relative w-32 h-32">
            <svg className="absolute inset-0" viewBox="0 0 100 100">
              <circle
                className="text-[#4d0013] stroke-current"
                strokeWidth="10"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>
              <motion.circle
                className="text-[#ffd700] stroke-current"
                strokeWidth="10"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength:
                    countdown !== null ? countdown / (timeRemaining ?? 30) : 0,
                }}
                transition={{ duration: timeRemaining ?? 30, ease: "linear" }}
              ></motion.circle>
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#ffd700]">
              {countdown}
            </div>
          </div>
          <p className="text-sm italic text-[#f0e68c]">
            Respiremos juntos y disfrutemos del momento
          </p>
        </div>
        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            className="bg-[#ffd700] text-[#800020] hover:bg-[#f0e68c] transition-colors duration-200"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
