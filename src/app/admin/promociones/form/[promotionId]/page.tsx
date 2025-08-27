"use client";

import PromocionForm from "../../_components/promocion-form";
import { usePromocionesStore } from "@/store/promociones.store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PromocionInterface } from "../../interface/promocion.interface";
import { Skeleton } from "@/components/ui/skeleton";

export default function FormPage({ params }: { params: { promotionId: string } }) {
  const { data: session } = useSession();
  const { fetchPromociones } = usePromocionesStore();
  const [promotion, setPromotion] = useState<PromocionInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromotion = async () => {
      if (session?.user.token && params.promotionId) {
        try {
          // Buscar la promoción en el store
          const { promociones } = usePromocionesStore.getState();
          const foundPromotion = promociones.find(p => p.id === parseInt(params.promotionId));
          
          if (foundPromotion) {
            setPromotion(foundPromotion);
          } else {
            // Si no está en el store, refrescar y buscar de nuevo
            await fetchPromociones(session.user.token);
            const { promociones: refreshedPromociones } = usePromocionesStore.getState();
            const refreshedFoundPromotion = refreshedPromociones.find(p => p.id === parseInt(params.promotionId));
            setPromotion(refreshedFoundPromotion || null);
          }
        } catch (error) {
          console.error("Error al cargar la promoción:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPromotion();
  }, [session?.user.token, params.promotionId, fetchPromociones]);

  if (loading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-8 w-64 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Promoción no encontrada</h1>
        <p>La promoción que intentas editar no existe o no tienes permisos para acceder a ella.</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Editar Promoción</h1>
      <PromocionForm promotion={promotion} />
    </div>
  );
}
