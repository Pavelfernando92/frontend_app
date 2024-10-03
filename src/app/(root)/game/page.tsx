"use client";

import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { RoomsInterface } from "../interfaces/rooms.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile } from "lucide-react";

function GamePage() {
  const { data: session, status } = useSession();
  const [room, setRoom] = useState<RoomsInterface>();

  const getRoom = async (token: string) => {
    try {
      const res = await lotussApi("rooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRoom(res.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!session && status === "loading") {
      console.log("cargando");
      return;
    }

    if (session && status === "authenticated") {
      getRoom(session.user.token);
    }
  }, [session, status]);

  if (!room) {
    return (
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
  }

  const availableNumbers = room?.numbers.filter((n) => !n.userId).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#800020] to-[#FF0000] text-white">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 bg-white/10 backdrop-blur-lg border-none">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-yellow-300">
              ¡Bienvenido a la Sala #{room.id}!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-base sm:text-lg font-semibold text-yellow-100">
                  Números Disponibles:
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-300">
                  {availableNumbers} / 100
                </p>
              </div>
              <div>
                <p className="text-base sm:text-lg font-semibold text-yellow-100">
                  Estado de la Sala:
                </p>
                <Badge
                  variant={room.status === "ABIERTA" ? "default" : "secondary"}
                  className="text-base sm:text-lg bg-yellow-300 text-[#800020]"
                >
                  {room.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white/10 backdrop-blur-lg border-none">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold text-yellow-300">
              Leyenda de Colores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 sm:w-6 h-5 sm:h-6 bg-gray-300 rounded"></div>
                <span className="text-yellow-100 text-sm sm:text-base">
                  Números disponibles
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 sm:w-6 h-5 sm:h-6 bg-red-500 rounded"></div>
                <span className="text-yellow-100 text-sm sm:text-base">
                  Números ocupados
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 sm:w-6 h-5 sm:h-6 bg-yellow-300 rounded"></div>
                <span className="text-yellow-100 text-sm sm:text-base">
                  Tus números seleccionados
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-none">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-yellow-300">
              Números
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {room.numbers.map((number) => (
                <div
                  key={number.id}
                  className={`aspect-square flex items-center justify-center rounded-md text-xs sm:text-sm font-medium ${
                    number.userId === session?.user.id
                      ? "bg-yellow-300 text-[#800020]"
                      : number.userId
                      ? "bg-red-500 text-transparent"
                      : "bg-gray-300 text-transparent"
                  } transition-all duration-300 ease-in-out hover:scale-105`}
                >
                  {number.userId === session?.user.id ? number.valor : "?"}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default GamePage;
