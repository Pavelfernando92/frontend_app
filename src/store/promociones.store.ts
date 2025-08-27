import { create } from 'zustand';
import { PromocionInterface, CreatePromocionData, UpdatePromocionData } from '@/app/admin/promociones/interface/promocion.interface';
import lotussApi from '@/lib/axios';

interface PromocionesStore {
  promociones: PromocionInterface[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setPromociones: (promociones: PromocionInterface[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API calls
  fetchPromociones: (token: string) => Promise<void>;
  createPromotion: (promotionData: CreatePromocionData, token: string) => Promise<PromocionInterface>;
  updatePromotion: (id: number, promotionData: UpdatePromocionData, token: string) => Promise<PromocionInterface>;
  deletePromotion: (id: number, token: string) => Promise<boolean>;
  
  // Local state updates
  removePromotion: (id: number) => void;
  addPromotion: (promotion: PromocionInterface) => void;
  updatePromotionLocal: (id: number, promotion: PromocionInterface) => void;
}

export const usePromocionesStore = create<PromocionesStore>((set, get) => ({
  promociones: [],
  loading: false,
  error: null,
  
  setPromociones: (promociones) => set({ promociones }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  fetchPromociones: async (token: string) => {
    try {
      set({ loading: true, error: null });
      const res = await lotussApi("promotions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ promociones: res.data, loading: false });
    } catch (error) {
      set({ 
        error: `Error al obtener promociones: ${error}`, 
        loading: false 
      });
    }
  },
  
  createPromotion: async (promotionData: CreatePromocionData, token: string) => {
    try {
      set({ loading: true, error: null });
      
      const formData = new FormData();
      formData.append('title', promotionData.title);
      formData.append('description', promotionData.description);
      formData.append('validUntil', promotionData.validUntil);
      
      if (promotionData.image) {
        formData.append('image', promotionData.image);
      }

      const res = await lotussApi.post("promotions", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set({ loading: false });
      get().addPromotion(res.data);
      return res.data;
    } catch (error) {
      set({ 
        error: `Error al crear la promoción: ${error}`, 
        loading: false 
      });
      throw error;
    }
  },
  
  updatePromotion: async (id: number, promotionData: UpdatePromocionData, token: string) => {
    try {
      set({ loading: true, error: null });
      
      const formData = new FormData();
      
      if (promotionData.title) formData.append('title', promotionData.title);
      if (promotionData.description) formData.append('description', promotionData.description);
      if (promotionData.validUntil) formData.append('validUntil', promotionData.validUntil);
      if (promotionData.status !== undefined) formData.append('status', promotionData.status.toString());
      if (promotionData.image) formData.append('image', promotionData.image);

      const res = await lotussApi.patch(`promotions/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set({ loading: false });
      get().updatePromotionLocal(id, res.data);
      return res.data;
    } catch (error) {
      set({ 
        error: `Error al actualizar la promoción: ${error}`, 
        loading: false 
      });
      throw error;
    }
  },
  
  deletePromotion: async (id: number, token: string) => {
    try {
      set({ loading: true, error: null });
      
      await lotussApi.delete(`promotions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set({ loading: false });
      get().removePromotion(id);
      return true;
    } catch (error) {
      set({ 
        error: `Error al eliminar la promoción: ${error}`, 
        loading: false 
      });
      throw error;
    }
  },
  
  removePromotion: (id: number) => {
    set((state) => ({
      promociones: state.promociones.filter(promocion => promocion.id !== id)
    }));
  },
  
  addPromotion: (promotion: PromocionInterface) => {
    set((state) => ({
      promociones: [...state.promociones, promotion]
    }));
  },
  
  updatePromotionLocal: (id: number, promotion: PromocionInterface) => {
    set((state) => ({
      promociones: state.promociones.map(p => p.id === id ? promotion : p)
    }));
  },
}));
