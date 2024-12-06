"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import TotalCreditsAmbassador from "./TotalCreditsAmbassador";

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
    accessorKey: "credits-ambassador",
    header: "Creditos como Embajador",
    cell: ({ row }) => {
      const userId = row.original.id;
      return <TotalCreditsAmbassador userId={userId} />;
    },
  },
];
