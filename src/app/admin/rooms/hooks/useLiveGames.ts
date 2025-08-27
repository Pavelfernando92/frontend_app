import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import lotussApi from "@/lib/axios";
import { LiveGame, LiveGameStats } from "../interfaces/live-games.interface";

export const useLiveGames = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveGames = useCallback(async (): Promise<LiveGame[] | null> => {
    if (!session?.user?.token) {
      setError("No hay sesión activa");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await lotussApi.get("/rooms", {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Error al obtener los juegos en vivo";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.token]);

  const calculateGameStats = useCallback((game: LiveGame): LiveGameStats => {
    const totalNumbers = game.numbers.length;
    const availableNumbers = game.numbers.filter(n => !n.userId).length;
    const takenNumbers = game.numbers.filter(n => n.userId).length;
    
    // Obtener usuarios únicos que están participando
    const uniqueUsers = new Set(
      game.numbers
        .filter(n => n.userId)
        .map(n => n.userId)
    );
    
    const participatingUsers = uniqueUsers.size;
    
    // Calcular total de números tomados por usuario
    const userNumbersCount = game.numbers
      .filter(n => n.userId)
      .reduce((acc, n) => {
        if (n.userId) {
          acc[n.userId] = (acc[n.userId] || 0) + 1;
        }
        return acc;
      }, {} as Record<number, number>);

    const totalNumbersTaken = Object.values(userNumbersCount).reduce((sum, count) => sum + count, 0);

    return {
      totalNumbers,
      availableNumbers,
      takenNumbers,
      participatingUsers,
      totalNumbersTaken
    };
  }, []);

  const getParticipatingUsers = useCallback((game: LiveGame) => {
    const userNumbers = game.numbers
      .filter(n => n.userId && n.user)
      .reduce((acc, n) => {
        if (n.userId && n.user) {
          if (!acc[n.userId]) {
            acc[n.userId] = {
              user: n.user,
              numbers: []
            };
          }
          acc[n.userId].numbers.push(n);
        }
        return acc;
      }, {} as Record<number, { user: any; numbers: any[] }>);

    return Object.values(userNumbers);
  }, []);

  return {
    fetchLiveGames,
    calculateGameStats,
    getParticipatingUsers,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
