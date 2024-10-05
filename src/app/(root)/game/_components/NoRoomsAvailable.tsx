import { Smile } from "lucide-react";

export const NoRoomsAvailable = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-[#800020] to-[#FF0000] text-white animate-pulse">
    <Smile className="text-6xl sm:text-8xl text-yellow-300 mb-4 animate-bounce" />
    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
      ¡Aún no hay salas disponibles!
    </h1>
    <p className="text-base sm:text-lg text-center">
      No te preocupes, estamos preparando algo divertido para ti...
    </p>
    <p className="text-base sm:text-lg text-center">
      ¡Relájate y espera unos momentos! 😊
    </p>
  </div>
);
