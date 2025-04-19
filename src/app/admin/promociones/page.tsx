"use client";

import { Skeleton } from "@/components/ui/skeleton";
import usePromociones from "./hooks/usePromociones";
import { columns } from "./_components/columns-promotions";
import { DataTable } from "./_components/data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PromocionesPage() {
  const { promociones, loading } = usePromociones();

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
