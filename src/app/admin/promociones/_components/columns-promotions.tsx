"use client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { PromocionInterface } from "../interface/promocion.interface";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ActionsMenu from "./actions-menu";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const ActionsCell = ({ row }: { row: Row<PromocionInterface> }) => {
  const { toast } = useToast();
  const promotion = row.original;
  const router = useRouter();
  return <ActionsMenu toast={toast} promotion={promotion} router={router} />;
};

export const columns: ColumnDef<PromocionInterface>[] = [
  {
    accessorKey: "title",
    header: "Titulo",
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ getValue }) => {
      const description = getValue() as string;
      const maxLength = 30; // Máximo de caracteres antes de truncar
      return description.length > maxLength
        ? `${description.substring(0, maxLength)}...`
        : description;
    },
  },
  {
    accessorKey: "validUntil",
    header: "Válido hasta",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return format(date, "dd/MM/yyyy");
    },
  },
  {
    accessorKey: "status",
    header: "Estatus",
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
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
