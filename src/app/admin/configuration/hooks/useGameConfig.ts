// hooks/useGameConfig.ts

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import lotussApi from "@/lib/axios";

const useGameConfig = () => {
  const { toast } = useToast();
  const { data: session } = useSession();

  const [cantidadGanancia, setCantidadGanancia] = useState<string>("");
  const [monedasRequeridas, setMonedasRequeridas] = useState<string>("");
  const [numerosTotales, setNumerosTotales] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [configExist, setConfigExist] = useState<boolean>(false);
  const [idConfig, setIdConfig] = useState<number | undefined>(undefined); // Iniciar como undefined

  // Función para cargar la configuración
  const loadConfiguration = async () => {
    if (!session) return;

    try {
      const res = await lotussApi("/config", {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });

      if (res.data.msg === "Aun no hay configuración") {
        toast({
          title: "¡Ingresa la configuración!",
          description: "Todos los valores deben ser registrados.",
          variant: "destructive",
        });
        return;
      }

      // Establecer valores en el estado
      setCantidadGanancia(res.data.prizeAmount);
      setMonedasRequeridas(res.data.minimumCredits);
      setNumerosTotales(res.data.totalOfNumbers);
      setConfigExist(true);
      setIdConfig(res.data.id);
    } catch (error) {
      console.error("Error al cargar configuración:", error);
    }
  };

  // Llamar a loadConfiguration al montarse el componente
  useEffect(() => {
    loadConfiguration();
  }, [session]);

  // Función para manejar el envío del formulario
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      Number(cantidadGanancia) <= 0 ||
      Number(monedasRequeridas) <= 0 ||
      Number(numerosTotales) <= 0
    ) {
      toast({
        title: "Entrada inválida",
        description: "Todos los valores deben ser mayores que cero.",
        variant: "destructive",
      });
      return;
    }

    try {
      const endpoint = configExist ? `/config/${idConfig}` : "/config"; // Endpoint basado en si existe configuración
      const method = configExist ? "put" : "post"; // Método basado en si existe configuración

      await lotussApi[method](
        endpoint,
        {
          prizeAmount: Number(cantidadGanancia),
          minimumCredits: Number(monedasRequeridas),
          totalOfNumbers: Number(numerosTotales),
        },
        {
          headers: {
            Authorization: `Bearer ${session!.user.token}`,
          },
        }
      );

      toast({
        title: "Configuración guardada",
        description: "La configuración del juego se ha actualizado con éxito.",
        variant: "success",
      });
      setIsEditing(false);
      setIdConfig(idConfig); // Mantener el mismo ID
    } catch (error) {
      toast({
        title: "¡Error!",
        description: "Error al grabar la información",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  // Función para alternar el estado de edición
  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  return {
    cantidadGanancia,
    setCantidadGanancia,
    monedasRequeridas,
    setMonedasRequeridas,
    numerosTotales,
    setNumerosTotales,
    manejarEnvio,
    isEditing,
    toggleEditing,
    configExist,
  };
};

export default useGameConfig;
