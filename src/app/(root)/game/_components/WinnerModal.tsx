"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WinnerInterface } from "../../interfaces/winner.interface";
import Confetti from "react-confetti";

interface WinnerModalProps {
  winner: WinnerInterface | null;
  isOpen: boolean;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  isOpen,
  onClose,
}) => {
  const [showRoulette, setShowRoulette] = useState(true);
  const [showWinner, setShowWinner] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowRoulette(true);
      setShowWinner(false);
      setShowConfetti(false);

      setTimeout(() => {
        setShowRoulette(false);
        setShowWinner(true);
        setShowConfetti(true);
      }, 3000);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-green-600 text-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {showRoulette ? "Seleccionando ganador..." : "¡Felicidades!"}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col items-center">
          {showRoulette && (
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          )}
          {showWinner && winner && (
            <>
              <img
                src={winner.image}
                alt={`${winner.name} ${winner.apellido}`}
                className="rounded-full h-24 w-24 mb-4"
              />
              <p className="text-lg">Número ganador: {winner.winningNumber}</p>
              <p className="text-lg">
                {winner.name} {winner.apellido}
              </p>
            </>
          )}
          {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}
        </div>
        <div className="flex justify-end p-4">
          <Button onClick={onClose} variant="secondary">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerModal;
