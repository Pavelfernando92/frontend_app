"use client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { PromocionInterface } from "../interface/promocion.interface";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ActionsMenu from "./actions-menu";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { PromotionImage } from "./promotion-image";
import { CalendarDays, ImageIcon } from "lucide-react";

const ActionsCell = ({ row }: { row: Row<PromocionInterface> }) => {
  const { toast } = useToast();
  const promotion = row.original;
  const router = useRouter();
  return <ActionsMenu toast={toast} promotion={promotion} router={router} />;
};

// Función helper para parsear fechas ISO correctamente
const parseISODate = (dateString: string) => {
  // Agregar 'T00:00:00.000Z' si no tiene tiempo para evitar problemas de zona horaria
  const fullDateString = dateString.includes('T') ? dateString : `${dateString}T00:00:00.000Z`;
  return new Date(fullDateString);
};

export const columns: ColumnDef<PromocionInterface>[] = [
  {
    accessorKey: "image",
    header: "Imagen",
    cell: ({ row }) => {
      const promotion = row.original;
      return (
        <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#800020] transition-colors">
          <PromotionImage
            imageUrl={promotion.image}
            alt={promotion.title}
            className="w-20 h-20 object-cover rounded-lg"
            fallbackText=""
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ getValue }) => {
      const title = getValue() as string;
      return (
        <div className="max-w-[200px]">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {title}
          </h3>
        </div>
      );
    },
  },
  {
    accessorKey: "validUntil",
    header: "Válido hasta",
    cell: ({ getValue }) => {
      const dateString = getValue() as string;
      // Corregir el problema de zona horaria
      const date = parseISODate(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Resetear tiempo a medianoche para comparación justa
      const isExpired = date < today;
      
      return (
        <div className="flex items-center gap-2">
          <CalendarDays className={`h-4 w-4 ${isExpired ? 'text-red-500' : 'text-green-500'}`} />
          <div>
            <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
              {format(date, "dd/MM/yyyy")}
            </span>
            {isExpired && (
              <div className="text-xs text-red-500">Expirada</div>
            )}
          </div>
        </div>
      );
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
            status ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"
          }
        >
          {status ? "ACTIVO" : "INACTIVO"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ getValue }) => {
      const dateString = getValue() as string;
      const date = parseISODate(dateString);
      return (
        <div className="text-sm text-gray-600">
          {format(date, "dd/MM/yyyy")}
        </div>
      );
    },
  },
  {
    header: "Acciones",
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
