"use client";

import { useState, useEffect } from "react";
import { CoinsIcon } from "lucide-react";
import { motion } from "framer-motion";

interface PrizeDisplayProps {
  prizeAmount: number;
  onParticipateClick: () => void;
}

export const PrizeDisplay = ({
  prizeAmount,
  onParticipateClick,
}: PrizeDisplayProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < prizeAmount) {
        setCount(Math.min(count + Math.ceil(prizeAmount / 50), prizeAmount));
      }
    }, 20);

    return () => clearTimeout(timer);
  }, [count, prizeAmount]);

  return (
    <motion.div
      className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 text-center shadow-2xl mb-6 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }} // Tap effect for mobile
      onClick={onParticipateClick} // Trigger scroll on click
    >
      <motion.div
        className="absolute inset-0 bg-yellow-300 opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-yellow-900">
        ¡Gran Premio!
      </h2>
      <p className="text-lg sm:text-xl lg:text-2xl text-yellow-800">
        Compite para ganar un premio de:
      </p>
      <motion.div
        className="flex justify-center items-center text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-4 sm:mt-6 mb-4 space-x-4"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <CoinsIcon className="w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20 text-yellow-900" />
        </motion.div>
        <span className="bg-yellow-300 px-4 py-2 rounded-lg text-yellow-900 text-3xl sm:text-4xl lg:text-5xl">
          {count.toLocaleString()}
        </span>
        <span className="text-3xl sm:text-4xl lg:text-5xl text-yellow-900">
          COINS!
        </span>
      </motion.div>
      <motion.p
        className="mt-4 sm:mt-6 text-lg sm:text-xl lg:text-2xl font-semibold text-yellow-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        ¡Participa ahora y asegura tu número!
      </motion.p>
      <motion.button
        className="mt-6 sm:mt-8 bg-yellow-900 text-yellow-100 px-6 sm:px-8 lg:px-12 py-3 rounded-full text-lg sm:text-xl lg:text-2xl font-bold shadow-lg hover:bg-yellow-800 transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ¡Participar Ahora!
      </motion.button>
    </motion.div>
  );
};
