"use client";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import useUsersStore from "@/store/users.store";

export default function UsuariosPage() {
  const { data: session, status } = useSession();
  const { getUsers, users } = useUsersStore();
  useEffect(() => {
    if (status === "authenticated") {
      getUsers(session.user.token);
    }
  }, [status]);
  return (
    <div className="container mx-auto py-10 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <Link href="/admin/usuarios/form">
          <Button>Agregar usuario</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  );
}
