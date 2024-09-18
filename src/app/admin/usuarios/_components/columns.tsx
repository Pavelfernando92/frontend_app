"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Phone, UserSearch } from "lucide-react";
import ButtonDelete from "./button-delete";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const user = row.original;
      const router = useRouter();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(user.telefono);
                toast({
                  title: "Número de Teléfono",
                  description: `El número de teléfono se copio en el portapapeles correctamente: ${user.telefono}`,
                });
              }}
            >
              <Phone className="mr-2 h-4 w-4" />
              Copiar número de teléfono
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push(`/admin/usuarios/form/${user.id}`);
              }}
            >
              <UserSearch className="mr-2 h-4 w-4" />
              Información del usuario
            </DropdownMenuItem>
            <ButtonDelete user={user} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
