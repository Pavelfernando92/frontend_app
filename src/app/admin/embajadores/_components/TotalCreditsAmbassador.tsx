// components/TotalCreditsAmbassador.tsx
import useGroup from "@/app/embajadores/hooks/useGroup";
import { useEffect, useState } from "react";

interface TotalCreditsAmbassadorProps {
  userId: number;
}

const TotalCreditsAmbassador: React.FC<TotalCreditsAmbassadorProps> = ({ userId }) => {
  const { getTotalCreditsGroupPerMonth } = useGroup();

  const [loading, setLoading] = useState<boolean>(false);
  const [totalCredits, setTotalCredits] = useState<number | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      setLoading(true);
      try {
        const credits = await getTotalCreditsGroupPerMonth(userId);
        setTotalCredits(credits);
      } catch (error) {
        console.log("Error al obtener todos los créditos");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCredits();
    }
  }, [userId, getTotalCreditsGroupPerMonth]);

  if (loading) {
    return <span>Cargando...</span>;
  }

  return <span>{totalCredits !== null ? totalCredits : "Sin datos"}</span>;
};

export default TotalCreditsAmbassador;
