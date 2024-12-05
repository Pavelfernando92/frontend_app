"use client";

import { ColumnDef } from "@tanstack/react-table";
import TransactionHistoryCell from "./TotalCreditsHistoryCell";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "creditos",
    header: "Creditos Actuales",
  },
  {
    accessorKey: "history",
    header: "Creditos Ingresados",
    cell: ({ row }) => {
      const userId = row.original.id;
      return <TransactionHistoryCell userId={userId} />;
    },
  },
];
