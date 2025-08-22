"use client";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import useUsersStore from "@/store/users.store";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsuariosPage() {
  const { data: session, status } = useSession();
  const { getUsers, users } = useUsersStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.token) {
      getUsers(session.user.token);
    }
  }, [status, session?.user?.token, getUsers]);

  const isLoading =
    status === "loading" || (status === "authenticated" && users.length === 0);

  return (
    <div className="container mx-auto py-10 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <Link href="/admin/usuarios/form">
          <Button>Agregar usuario</Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={users} />
      )}
    </div>
  );
}
