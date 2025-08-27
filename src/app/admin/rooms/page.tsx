"use client";

import { LiveGame } from "./interfaces/live-games.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Users, Clock, Award, Gamepad2, AlertCircle } from "lucide-react";
import { InfoItem } from "./_components/InfoItem";
import { RoomSkeleton } from "./_components/RoomSkeleton";
import { useLiveGames } from "./hooks/useLiveGames";
import { GameStats } from "./_components/game-stats";
import { ParticipatingUsers } from "./_components/participating-users";
import { NumbersGrid } from "./_components/numbers-grid";

function RoomsPage() {
  const { data: session } = useSession();
  const { fetchLiveGames, calculateGameStats, getParticipatingUsers, isLoading, error, clearError } = useLiveGames();
  const [liveGames, setLiveGames] = useState<LiveGame[]>([]);
  const [currentGame, setCurrentGame] = useState<LiveGame | null>(null);

  const getLiveGames = useCallback(async () => {
    const games = await fetchLiveGames();
    if (games && games.length > 0) {
      setLiveGames(games);
      setCurrentGame(games[0]); // Mostrar el primer juego
    }
  }, [fetchLiveGames]);

  useEffect(() => {
    if (!session) {
      console.log("Cargando sesión");
      return;
    }
    getLiveGames();
  }, [session, getLiveGames]);

  const handleClick = async () => {
    try {
      const res = await lotussApi.post(
        "rooms",
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      setLiveGames([res.data]);
      setCurrentGame(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const reloadGames = () => {
    getLiveGames();
  };

  const handleGameChange = (game: LiveGame) => {
    setCurrentGame(game);
  };

  if (!currentGame) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Juegos en Vivo</h2>
          <Button onClick={handleClick} variant="outline" className="w-full sm:w-auto">
            Crear Juego
          </Button>
        </div>
        <Card className="w-full shadow-lg">
          <CardContent className="p-6 sm:p-8 text-center">
            <Gamepad2 className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No hay juegos activos</h3>
            <p className="text-sm sm:text-base text-gray-500">Crea un nuevo juego para comenzar</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gameStats = calculateGameStats(currentGame);
  const participatingUsers = getParticipatingUsers(currentGame);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">Juegos en Vivo</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {liveGames.length > 1 && (
            <select
              value={currentGame.id}
              onChange={(e) => {
                const selectedGame = liveGames.find(g => g.id === Number(e.target.value));
                if (selectedGame) handleGameChange(selectedGame);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800020] text-sm"
            >
              {liveGames.map((game) => (
                <option key={game.id} value={game.id}>
                  Juego #{game.id} - {game.status}
                </option>
              ))}
            </select>
          )}
          <div className="flex gap-2">
            <Button onClick={reloadGames} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <RefreshCw className="mr-2 h-4 w-4" /> Recargar
            </Button>
            <Button onClick={handleClick} variant="outline" size="sm" className="flex-1 sm:flex-none">
              Crear Nuevo
            </Button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base">{error}</span>
              <Button variant="outline" size="sm" onClick={clearError} className="ml-auto">
                Cerrar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del Juego */}
      <Card className="w-full shadow-lg overflow-hidden mb-6">
        <CardHeader className="bg-[#800020] text-white">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl">
            Juego #{currentGame.id} - {currentGame.status}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 bg-gradient-to-br from-[#800020] to-[#4a0012] text-white">
          {isLoading ? (
            <RoomSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="space-y-3 sm:space-y-4">
                <InfoItem
                  icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="ID del Juego"
                  value={String(currentGame.id)}
                />
                <InfoItem
                  icon={<Users className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="Estado"
                  value={currentGame.status}
                />
                <InfoItem
                  icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="Creado"
                  value={new Date(currentGame.createdAt).toLocaleString()}
                />
                <InfoItem
                  icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="Actualizado"
                  value={new Date(currentGame.updatedAt).toLocaleString()}
                />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <InfoItem
                  icon={<Award className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="Ganador"
                  value={
                    currentGame.userWinnerId !== null
                      ? String(currentGame.userWinnerId)
                      : "Aún no hay ganador"
                  }
                />
                <InfoItem
                  icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5" />}
                  label="Hora del Sorteo"
                  value={
                    currentGame.drawStartTime
                      ? new Date(currentGame.drawStartTime).toLocaleString()
                      : "No programado"
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas del Juego */}
      <GameStats stats={gameStats} />

      {/* Usuarios Participando */}
      <div className="mb-6">
        <ParticipatingUsers participatingUsers={participatingUsers} />
      </div>

      {/* Grilla de Números */}
      <NumbersGrid numbers={currentGame.numbers} />
    </div>
  );
}

export default RoomsPage;
