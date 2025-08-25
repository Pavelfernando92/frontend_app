"use client";

import { motion } from "framer-motion";
import { Crown, Trophy, Star, Sparkles, TrendingUp, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { WinnerRoom } from "../interfaces/winner.interface";

interface LastWinnersProps {
  winners: WinnerRoom[];
  isLoading: boolean;
}

const LastWinners = ({ winners, isLoading }: LastWinnersProps) => {
  if (isLoading) {
    return (
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFD700]/20 via-[#800020]/10 to-[#FFD700]/20 border-2 border-[#FFD700]/30 shadow-2xl mb-16 p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
          <p className="text-[#FFD700] text-lg font-semibold">
            Cargando ganadores...
          </p>
        </div>
      </motion.div>
    );
  }

  if (!winners || winners.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Función para obtener un badge de celebración
  const getCelebrationBadge = (index: number) => {
    const badges = [
      { icon: Crown, text: "¡GANADOR!", color: "from-[#FFD700] to-[#FFA500]" },
      {
        icon: Trophy,
        text: "¡FELICIDADES!",
        color: "from-[#FFD700] to-[#FFA500]",
      },
      { icon: Award, text: "¡ÉXITO!", color: "from-[#FFD700] to-[#FFA500]" },
    ];

    const badge = badges[index] || badges[0];
    const IconComponent = badge.icon;

    return (
      <Badge
        className={`bg-gradient-to-r ${badge.color} text-[#800020] px-3 py-1 font-bold text-sm shadow-lg`}
      >
        <IconComponent className="h-4 w-4 mr-1" />
        {badge.text}
      </Badge>
    );
  };

  // Reordenar ganadores para que el más reciente esté en el medio
  const getReorderedWinners = () => {
    const reordered = [];
    if (winners.length >= 1) reordered[1] = winners[0]; // El primero (más reciente) va al medio
    if (winners.length >= 2) reordered[0] = winners[1]; // El segundo va a la izquierda
    if (winners.length >= 3) reordered[2] = winners[2]; // El tercero va a la derecha
    return reordered.filter(Boolean); // Filtrar elementos undefined
  };

  const reorderedWinners = getReorderedWinners();

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFD700]/20 via-[#800020]/10 to-[#FFD700]/20 border-2 border-[#FFD700]/30 shadow-2xl mb-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#FFD700]/20"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-8 lg:p-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-center mb-8 gap-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          >
            <div className="relative flex items-center">
              <Crown className="h-16 w-16 text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Sparkles className="h-8 w-8 text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
              </motion.div>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.7)] relative text-center">
              <span className="relative z-10">¡RECIENTES GANADORES!</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] opacity-30 blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.4, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </h2>
          </motion.div>

          <motion.p
            className="text-xl lg:text-2xl text-white font-semibold max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Estos jugadores han tenido la suerte de ganar recientemente en
            ScratchRoom.
            <span className="text-[#FFD700] font-bold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              {" "}
              ¡Tú podrías ser el próximo!
            </span>
          </motion.p>

          <motion.div
            className="flex items-center justify-center mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] text-[#800020] px-8 py-4 rounded-full font-bold text-xl shadow-2xl border-2 border-white/20 relative overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 flex items-center gap-3">
                <TrendingUp className="h-6 w-6" />
                ¡Únete a la diversión!
                <Sparkles className="h-6 w-6" />
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reorderedWinners.map((winner, displayIndex) => (
            <motion.div
              key={winner.id}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + displayIndex * 0.2, duration: 0.8 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              {/* Celebration Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                {getCelebrationBadge(displayIndex)}
              </div>

              {/* Winner Card */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-2 border-[#FFD700]/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: displayIndex * 0.5,
                  }}
                />

                <div className="relative z-10 text-center">
                  {/* Avatar */}
                  <motion.div
                    className="mb-6"
                    whileHover={{ rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar className="w-24 h-24 mx-auto border-4 border-[#FFD700]/50 shadow-2xl">
                      <AvatarImage
                        src={winner.winner.profilePicture}
                        alt={`${winner.winner.nombre} ${winner.winner.apellido_paterno}`}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-r from-[#FFD700] to-[#800020] text-white font-bold text-2xl">
                        {winner.winner.nombre?.charAt(0) || "G"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  {/* Winner Info */}
                  <motion.h3
                    className="font-bold text-xl text-white mb-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {winner.winner.nombre} {winner.winner.apellido_paterno}
                  </motion.h3>

                    {/* Winner Info */}
                  <motion.p
                    className="font-bold text-xl text-white mb-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {winner.winner.email}
                  </motion.p>

                  <motion.div
                    className="text-[#FFD700] text-lg font-semibold mb-4"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: displayIndex * 0.3,
                    }}
                  >
                    ¡RECIENTE GANADOR!
                  </motion.div>

                  {/* Date */}
                  <div className="text-white/70 text-sm mb-4">
                    Ganó el {formatDate(winner.drawStartTime)}
                  </div>

                  {/* Celebration Icon */}
                  <motion.div
                    className="flex justify-center"
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: displayIndex * 0.2,
                    }}
                  >
                    <Star className="h-6 w-6 text-[#FFD700] fill-current" />
                  </motion.div>
                </div>

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FFD700]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <motion.div
            className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] text-[#800020] px-8 py-4 rounded-full font-bold text-xl shadow-2xl border-2 border-white/20 inline-block relative overflow-hidden group cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <div className="relative z-10 flex items-center gap-3">
              <Sparkles className="h-6 w-6" />
              ¡TÚ PUEDES SER EL PRÓXIMO GANADOR!
              <Sparkles className="h-6 w-6" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LastWinners;
