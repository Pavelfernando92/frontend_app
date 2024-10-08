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
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Loader2 } from "lucide-react";

interface WinnerModalProps {
  winner: WinnerInterface | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function WinnerModal({
  winner,
  isOpen,
  onClose,
}: WinnerModalProps) {
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
      <DialogContent className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-lg shadow-xl border-0 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            {showRoulette ? "Seleccionando ganador..." : "¡Felicidades!"}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {showRoulette && (
              <motion.div
                key="roulette"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex flex-col items-center"
              >
                <Loader2 className="h-24 w-24 animate-spin text-white mb-4" />
                <p className="text-lg font-semibold">
                  La suerte está girando...
                </p>
              </motion.div>
            )}
            {showWinner && winner && (
              <motion.div
                key="winner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <img
                    src={winner.image}
                    alt={`${winner.name} ${winner.apellido}`}
                    className="rounded-full h-32 w-32 border-4 border-white shadow-lg"
                  />
                  <Trophy className="absolute -top-4 -right-4 h-12 w-12 text-yellow-300" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {winner.name} {winner.apellido}
                </h3>
                <p className="text-xl font-semibold mb-4">
                  Número ganador: {winner.winningNumber}
                </p>
                <div className="bg-white text-green-700 px-4 py-2 rounded-full font-bold text-lg">
                  ¡Ganador!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {showConfetti && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
            />
          )}
        </div>
        <div className="flex justify-center p-4">
          <Button
            onClick={onClose}
            variant="secondary"
            className="bg-white text-green-700 hover:bg-green-100 transition-colors duration-200"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
