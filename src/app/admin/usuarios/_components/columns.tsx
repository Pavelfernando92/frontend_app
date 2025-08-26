"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ActionsMenu from "./actions-menu";
import { format } from "date-fns";

const ActionsCell = ({ row }: { row: Row<User> }) => {
  const { toast } = useToast();
  const user = row.original; // Esto ahora tiene el tipo `User`
  const router = useRouter();
  return <ActionsMenu toast={toast} user={user} router={router} />;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {user.nombre} {user.apellido_paterno} {user.apellido_materno}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "apellido_paterno",
    header: "Apellido Paterno",
    cell: ({ row }) => row.original.apellido_paterno,
  },
  {
    accessorKey: "apellido_materno",
    header: "Apellido Materno",
    cell: ({ row }) => row.original.apellido_materno,
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
    cell: ({ row }) => row.original.telefono,
  },
  {
    accessorKey: "creditos",
    header: "Créditos",
    cell: ({ row }) => {
      const creditos = row.original.creditos;
      return (
        <span className={`font-mono ${creditos > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {creditos.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Registro",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return format(date, "dd/MM/yyyy HH:mm");
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant="outline"
          className={
            status ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }
        >
          {status ? "ACTIVO" : "INACTIVO"}
        </Badge>
      );
    },
  },
  {
    header: "Acciones",
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />, // Ahora 'row' tiene el tipo correcto
  },
];
