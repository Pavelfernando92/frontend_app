import { Timer } from "lucide-react"

export const FinishedRoom = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-[#800020] to-[#FF0000] text-white">
    <Timer className="text-6xl sm:text-8xl text-yellow-300 mb-4 animate-pulse" />
    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
      La sala está cerrada
    </h1>
    <p className="text-base sm:text-lg text-center mb-2">
      El sorteo ha terminado. Espera la nueva sala.
    </p>
    <p className="text-base sm:text-lg text-center">
      ¡Pronto habrá nuevas oportunidades! 😊
    </p>
  </div>
)