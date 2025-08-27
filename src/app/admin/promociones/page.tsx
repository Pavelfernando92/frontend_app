"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./_components/columns-promotions";
import { DataTable } from "./_components/data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePromocionesStore } from "@/store/promociones.store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function PromocionesPage() {
  const { data: session } = useSession();
  const { promociones, loading, fetchPromociones } = usePromocionesStore();

  useEffect(() => {
    if (session?.user.token) {
      fetchPromociones(session.user.token);
    }
  }, [session?.user.token, fetchPromociones]);

  return (
    <div className="container mx-auto py-10 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Promociones</h2>
        <Link href="/admin/promociones/form">
          <Button>Agregar promoción</Button>
        </Link>
      </div>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={promociones} />
      )}
    </div>
  );
}
