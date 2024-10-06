"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronRight, Trophy, X } from "lucide-react";
import lotussApi from "@/lib/axios";
import { UserGameHistoryResponse } from "../../interfaces/games-history.interface";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { GameStatus } from "./GameStatus";
import { GameDetailsModal } from "./GameDetailsModal";

const HistoryGames = () => {
  const { data: session } = useSession();
  const [games, setGames] = useState<UserGameHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] =
    useState<UserGameHistoryResponse | null>(null);

  useEffect(() => {
    if (!session) return;

    const getHistoryGames = async () => {
      try {
        setLoading(true);
        const res = await lotussApi(`usuarios/${session?.user.id}/history`, {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        });
        setGames(res.data);
      } catch (error) {
        console.error("Error fetching game history:", error);
      } finally {
        setLoading(false);
      }
    };
    getHistoryGames();
  }, [session]);

  if (!session) return null;

  return (
    <Card className="bg-gradient-to-br from-[#800020] to-[#4a0012] text-white overflow-hidden shadow-lg">
      <CardHeader className="bg-[#800020] p-6">
        <CardTitle className="text-[#FFD700] text-3xl font-bold">
          Juegos Recientes
        </CardTitle>
        <CardDescription className="text-[#FFD700] font-semibold text-lg">
          Tus últimos 5 juegos
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <GamesSkeleton />
        ) : (
          <AnimatePresence>
            <ul className="space-y-4">
              {games.slice(0, 5).map((game, index) => (
                <motion.li
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-[#FFFFFF]/10 rounded-lg p-4 flex justify-between items-center hover:bg-[#FFFFFF]/20 transition-all cursor-pointer"
                  onClick={() => setSelectedGame(game)}
                >
                  <div className="flex items-center">
                    <History className="mr-3 h-6 w-6 text-[#FFD700]" />
                    <span className="text-lg">Sala {game.id}</span>
                  </div>
                  <div className="flex items-center">
                    <GameStatus game={game} id={session.user.id} />
                    <ChevronRight className="ml-2 h-5 w-5 text-[#FFD700]" />
                  </div>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        )}
      </CardContent>
      <GameDetailsModal
        game={selectedGame!}
        onClose={() => setSelectedGame(null)}
      />
    </Card>
  );
};

const GamesSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-[#FFFFFF]/10 rounded-lg p-4"
      >
        <Skeleton className="h-6 w-1/3 bg-[#FFFFFF]/20" />
        <Skeleton className="h-6 w-1/4 bg-[#FFFFFF]/20" />
      </div>
    ))}
  </div>
);

export default HistoryGames;
