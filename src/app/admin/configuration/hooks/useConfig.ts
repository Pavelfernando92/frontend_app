// hooks/useConfig.ts
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import lotussApi from "@/lib/axios";
import { ConfigutarionInterface } from "@/app/(root)/interfaces/config.interface"; // Asegúrate de que la ruta sea correcta

export const useConfig = () => {
  const { data: session, status } = useSession();
  const [config, setConfig] = useState<ConfigutarionInterface | null>(null);
  const [errorModalState, setErrorModalState] = useState({
    isOpen: false,
    message: "",
  });

  useEffect(() => {
    if (session && status === "authenticated") {
      fetchConfigData(session.user.token);
    }
  }, [session, status]);

  const fetchConfigData = async (token: string) => {
    try {
      const { data } = await lotussApi("/config", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfig({
        minimumCredits: data.minimumCredits,
        prizeAmount: data.prizeAmount,
        totalOfNumbers: data.totalOfNumbers,
        invitationsForReward: data.invitationsForReward,
        invitationReward: data.invitationReward,
      });
    } catch (error) {
      console.log(`Error al obtener la configuración`);
      setErrorModalState({
        isOpen: true,
        message: "Error al obtener la configuración.",
      });
    }
  };

  return {
    config,
    errorModalState,
    setErrorModalState,
  };
};
