"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ActionsMenu from "./actions-menu";

const ActionsCell = ({ row }: { row: Row<User> }) => {
  const { toast } = useToast();
  const user = row.original; // Esto ahora tiene el tipo `User`
  const router = useRouter();
  return <ActionsMenu toast={toast} user={user} router={router} />;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "telefono",
    header: "Telefono",
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
