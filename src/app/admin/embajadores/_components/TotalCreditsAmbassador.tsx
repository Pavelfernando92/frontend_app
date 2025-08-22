import useGroup from "@/app/embajadores/hooks/useGroup";
import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";

interface TotalCreditsAmbassadorProps {
  userId: number;
}

const TotalCreditsAmbassador: React.FC<TotalCreditsAmbassadorProps> = ({
  userId,
}) => {
  const { getTotalCreditsGroupPerMonth } = useGroup();

  const [loading, setLoading] = useState<boolean>(false);
  const [totalCredits, setTotalCredits] = useState<number | null>(null);

  const setTotalCreditsAmbassador = useCallback(async () => {
    setLoading(true);
    try {
      setTotalCredits(await getTotalCreditsGroupPerMonth(userId));
    } catch (error) {
      console.log("Error al obtener todos los creditos");
    } finally {
      setLoading(false);
    }
  }, [getTotalCreditsGroupPerMonth, userId]);

  useEffect(() => {
    setTotalCreditsAmbassador();
  }, [setTotalCreditsAmbassador]);

  if (loading) {
    return <span>Cargando...</span>;
  }

  return <span>{totalCredits !== null ? totalCredits : "Sin datos"}</span>;
};

export default TotalCreditsAmbassador;
