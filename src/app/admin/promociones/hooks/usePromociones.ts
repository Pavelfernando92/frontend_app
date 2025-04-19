import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { PromocionInterface } from "../interface/promocion.interface";
import { useEffect, useState } from "react";

const usePromociones = () => {
  const { data: session } = useSession();
  const [promociones, setPromociones] = useState<PromocionInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getPromociones();
  }, []);

  const getPromociones = async () => {
    try {
      setLoading(true);
      const res = await lotussApi("promotions", {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      setPromociones(res.data);
    } catch (error) {
      console.log(`Error al obtener promociones: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getPromocion = async (id: number) => {
    try {
      setLoading(true);
      const res = await lotussApi(`promotions/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.log(`Error al obtener la promoción: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const deletePromotion = async (id: number) => {
    try {
      setLoading(true);
      await lotussApi.delete(`promotions/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      await getPromociones();
    } catch (error) {
      console.log(`Error al eliminar la promoción: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const createPromotion = async (payload: any) => {
    try {
      setLoading(true);
      const res = await lotussApi.post("promotions", payload, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      setPromociones((prev) => [...prev, res.data]);
    } catch (error) {
      console.log(`Error al crear la promoción: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const updatePromotion = async (id: number, payload: any) => {
    try {
      setLoading(true);
      const res = await lotussApi.patch(`promotions/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      const updatedPromociones = promociones.map((promocion) =>
        promocion.id === id ? res.data : promocion
      );
      setPromociones(updatedPromociones);
    } catch (error) {
      console.log(`Error al actualizar la promoción: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    promociones,
    loading,

    setPromociones,
    getPromociones,
    getPromocion,
    deletePromotion,
    createPromotion,
    updatePromotion,
  };
};

export default usePromociones;
