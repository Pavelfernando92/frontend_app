"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import lotussApi from "@/lib/axios";
import { History } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserGameHistoryResponse } from "../../interfaces/games-history.interface";

const HistoryGames = () => {
  const { data: session } = useSession();

  const [games, setGames] = useState<UserGameHistoryResponse[]>([]);

  useEffect(() => {
    if (!session) {
      return;
    }
    const getHistoryGames = async () => {
      try {
        const res = await lotussApi(`usuarios/${session?.user.id}/history`, {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        });
        setGames(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getHistoryGames();
  }, [session]);

  if (!session) {
    return;
  }

  return (
    <Card className="bg-[#FFFFFF]/10 backdrop-blur-lg text-white">
      <CardHeader>
        <CardTitle className="text-[#FFD700] text-2xl">
          Juegos Recientes
        </CardTitle>
        <CardDescription className="text-[#FFD700] font-bold">
          Tus ultimos 5 juegos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {games.slice(0, 5).map((game, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b border-[#FFD700]/20 pb-2"
            >
              <div className="flex items-center">
                <History className="mr-2 h-5 w-5 text-[#FFD700]" />
                <span>Sala {game.salasParticipadas[index]?.id}</span>
              </div>
              <div>
                <span className="mr-2">Resultado:</span>
                <span
                  className={
                    game.salasParticipadas[index]
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {game.salasParticipadas[index] ? "Ganado" : "Perdido"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default HistoryGames;
