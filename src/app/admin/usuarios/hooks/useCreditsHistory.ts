import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import lotussApi from "@/lib/axios";
import { HistoricCoinsResponse, CreditsHistoryFilters } from "../interfaces/credits-history.interface";

export const useCreditsHistory = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditsHistory = useCallback(async (
    userId: number,
    filters: CreditsHistoryFilters
  ): Promise<HistoricCoinsResponse | null> => {
    if (!session?.user?.token) {
      setError("No hay sesión activa");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await lotussApi.get(
        `/usuarios/${userId}/credits-history?${params}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Error al obtener el historial de créditos";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.token]);

  return {
    fetchCreditsHistory,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
