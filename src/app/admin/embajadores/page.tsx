"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "../usuarios/_components/data-table";
import useAmbassors from "./hooks/useAmbassors";
import { columns } from "./_components/columns-ambassadors";

export default function UsuariosPage() {
  const { ambassors, loading } = useAmbassors();

  return (
    <div className="container mx-auto py-10 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Usuarios Embajadores</h2>
      </div>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={ambassors} />
      )}
    </div>
  );
}
