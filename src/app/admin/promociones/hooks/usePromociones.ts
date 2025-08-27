import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { PromocionInterface, CreatePromocionData, UpdatePromocionData } from "../interface/promocion.interface";
import { useEffect, useState, useCallback } from "react";

const usePromociones = () => {
  const { data: session } = useSession();
  const [promociones, setPromociones] = useState<PromocionInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getPromociones = useCallback(async () => {
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
  }, [session?.user.token]);

  useEffect(() => {
    if (session?.user.token) {
      getPromociones();
    }
  }, [getPromociones, session?.user.token]);

  const getPromocion = useCallback(async (id: number) => {
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
      throw error;
    } finally {
      setLoading(false);
    }
  }, [session?.user.token]);

  const deletePromotion = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await lotussApi.delete(`promotions/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      
      // Actualizar la lista local después de eliminar
      setPromociones(prev => prev.filter(promocion => promocion.id !== id));
      
      return true;
    } catch (error) {
      console.log(`Error al eliminar la promoción: ${error}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [session?.user.token]);

  const createPromotion = useCallback(async (promotionData: CreatePromocionData) => {
    try {
      setLoading(true);
      
      // Crear FormData para enviar imagen
      const formData = new FormData();
      formData.append('title', promotionData.title);
      formData.append('description', promotionData.description);
      formData.append('validUntil', promotionData.validUntil);
      
      if (promotionData.image) {
        formData.append('image', promotionData.image);
      }

      const res = await lotussApi.post("promotions", formData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
          // No incluir Content-Type para FormData
        },
      });
      
      setPromociones((prev) => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.log(`Error al crear la promoción: ${error}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [session?.user.token]);

  const updatePromotion = useCallback(async (id: number, promotionData: UpdatePromocionData) => {
    try {
      setLoading(true);
      
      // Crear FormData para enviar imagen
      const formData = new FormData();
      
      if (promotionData.title) formData.append('title', promotionData.title);
      if (promotionData.description) formData.append('description', promotionData.description);
      if (promotionData.validUntil) formData.append('validUntil', promotionData.validUntil);
      if (promotionData.status !== undefined) formData.append('status', promotionData.status.toString());
      if (promotionData.image) formData.append('image', promotionData.image);

      const res = await lotussApi.patch(`promotions/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
          // No incluir Content-Type para FormData
        },
      });
      
      // Actualizar la lista local después de actualizar
      setPromociones(prev => prev.map(promocion => 
        promocion.id === id ? res.data : promocion
      ));
      
      return res.data;
    } catch (error) {
      console.log(`Error al actualizar la promoción: ${error}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [session?.user.token]);

  // Función para refrescar la lista completa
  const refreshPromociones = useCallback(() => {
    getPromociones();
  }, [getPromociones]);

  return {
    promociones,
    loading,
    setPromociones,
    getPromociones,
    getPromocion,
    deletePromotion,
    createPromotion,
    updatePromotion,
    refreshPromociones, // Nueva función para refrescar
  };
};

export default usePromociones;
