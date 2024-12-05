import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import lotussApi from "@/lib/axios";

const useGameConfig = () => {
  const { toast } = useToast();
  const { data: session } = useSession();

  const [config, setConfig] = useState({
    cantidadGanancia: "",
    monedasRequeridas: "",
    numerosTotales: "",
    invitationsForReward: "",
    invitationReward: "",
    creditsPerMonth: "",
    rewardGoalCredits: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [configExist, setConfigExist] = useState(false);
  const [idConfig, setIdConfig] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false); // Estado isLoading

  const loadConfiguration = useCallback(async () => {
    if (!session) return;

    setIsLoading(true); // Inicia la carga

    try {
      const { data } = await lotussApi.get("/config", {
        headers: { Authorization: `Bearer ${session.user.token}` },
      });

      if (data.msg === "Aun no hay configuración") {
        toast({
          title: "¡Ingresa la configuración!",
          description: "Todos los valores deben ser registrados.",
          variant: "destructive",
        });
        return;
      }

      setConfig({
        cantidadGanancia: data.prizeAmount,
        monedasRequeridas: data.minimumCredits,
        numerosTotales: data.totalOfNumbers,
        invitationsForReward: data.invitationsForReward,
        invitationReward: data.invitationReward,
        creditsPerMonth: data.creditsPerMonth,
        rewardGoalCredits: data.rewardGoalCredits,
      });
      setConfigExist(true);
      setIdConfig(data.id);
    } catch (error) {
      console.error("Error al cargar configuración:", error);
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  }, [session, toast]);

  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      cantidadGanancia,
      monedasRequeridas,
      numerosTotales,
      invitationsForReward,
      invitationReward,
      creditsPerMonth,
      rewardGoalCredits,
    } = config;

    if (
      [
        cantidadGanancia,
        monedasRequeridas,
        numerosTotales,
        invitationsForReward,
        invitationReward,
        creditsPerMonth,
        rewardGoalCredits,
      ].some((value) => Number(value) <= 0)
    ) {
      toast({
        title: "Entrada inválida",
        description: "Todos los valores deben ser mayores que cero.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true); // Inicia la carga al enviar

    try {
      const endpoint = configExist ? `/config/${idConfig}` : "/config";
      const method = configExist ? "put" : "post";

      await lotussApi[method](
        endpoint,
        {
          prizeAmount: Number(cantidadGanancia),
          minimumCredits: Number(monedasRequeridas),
          totalOfNumbers: Number(numerosTotales),
          invitationsForReward: Number(invitationsForReward),
          invitationReward: Number(invitationReward),
          creditsPerMonth: Number(creditsPerMonth),
          rewardGoalCredits: Number(rewardGoalCredits),
        },
        {
          headers: { Authorization: `Bearer ${session!.user.token}` },
        }
      );

      toast({
        title: "Configuración guardada",
        description: "La configuración del juego se ha actualizado con éxito.",
        variant: "success",
      });
      setIsEditing(false);
      setConfigExist(true);
    } catch (error) {
      toast({
        title: "¡Error!",
        description: "Error al grabar la información",
        variant: "destructive",
      });
      console.error("Error al grabar la configuración:", error);
    } finally {
      setIsLoading(false); // Finaliza la carga al enviar
    }
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const handleInputChange = (field: string, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  return {
    ...config,
    manejarEnvio,
    isEditing,
    toggleEditing,
    configExist,
    handleInputChange,
    isLoading, // Exporta el estado isLoading
  };
};

export default useGameConfig;
