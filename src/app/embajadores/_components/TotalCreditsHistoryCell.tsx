import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TransactionHistoryCellProps {
  userId: number;
}

const TransactionHistoryCell: React.FC<TransactionHistoryCellProps> = ({
  userId,
}) => {
  const { data: session } = useSession();
  const [history, setHistory] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!session) {
        return;
      }
      try {
        setLoading(true);
        const res = await lotussApi(`usuarios/${userId}/transaction-history`, {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        });

        const totalCredits = res.data.totalCredits || 0;
        setHistory(totalCredits);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        setHistory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId, session]);

  if (loading) {
    return <span>Cargando...</span>;
  }

  return <span>{history !== null ? history : "Sin datos"}</span>;
};

export default TransactionHistoryCell;
