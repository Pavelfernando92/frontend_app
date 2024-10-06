import { motion } from "framer-motion";
import { UserGameHistoryResponse } from "../../interfaces/games-history.interface";
import { Button } from "@/components/ui/button";
import { Trophy, X } from "lucide-react";

interface Props {
  game: UserGameHistoryResponse;
  onClose: () => void;
}

export const GameDetailsModal = ({ game, onClose }: Props) => {
  if (!game) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-[#800020] p-6 rounded-lg max-w-md w-full shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-[#FFD700]">
            Detalles del Juego
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6 text-[#FFD700]" />
          </Button>
        </div>
        <div className="space-y-4 text-white">
          <p>
            <strong>Sala:</strong> {game.id}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            {game.winner ? "Finalizado" : "En Progreso"}
          </p>
          {game.winner && (
            <p className="flex items-center">
              <strong>Ganador:</strong>
              <span className="ml-2 flex items-center">
                {game.winner.nombre} {game.winner.apellido_paterno}
                <Trophy className="ml-2 h-5 w-5 text-[#FFD700]" />
              </span>
            </p>
          )}
          <p>
            <strong>Fecha:</strong> {new Date(game.updatedAt).toLocaleString()}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
