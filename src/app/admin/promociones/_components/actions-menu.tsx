import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { PromocionInterface } from "../interface/promocion.interface";
import ButtonDelete from "./button-delete";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = {
  toast: any;
  promotion: PromocionInterface;
  router: any;
};

const ActionsMenu = ({ promotion, router }: Props) => {
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
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            router.push(`/admin/promociones/form/${promotion.id}`);
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar Promoción
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ButtonDelete promotion={promotion} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsMenu;
