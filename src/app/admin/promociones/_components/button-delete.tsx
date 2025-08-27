"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash, AlertTriangle, Loader2 } from "lucide-react";
import { PromocionInterface } from "../interface/promocion.interface";
import { usePromocionesStore } from "@/store/promociones.store";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

type Props = {
  promotion: PromocionInterface;
};

const ButtonDelete = ({ promotion }: Props) => {
  const { deletePromotion } = usePromocionesStore();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!session?.user.token) {
      toast({
        title: "Error",
        description: "No tienes autorización para realizar esta acción.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeleting(true);
      await deletePromotion(promotion.id, session.user.token);
      
      toast({
        title: "Promoción eliminada",
        description: `La promoción "${promotion.title}" ha sido eliminada correctamente.`,
        variant: "success",
      });
      
    } catch (error) {
      console.error("Error al eliminar la promoción:", error);
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la promoción. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem 
          onSelect={(e) => e.preventDefault()}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <Trash className="mr-2 h-4 w-4" />
          Eliminar promoción
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            ¿Eliminar promoción?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            <div className="space-y-2">
              <p>
                Estás a punto de eliminar la promoción:
              </p>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="font-medium text-gray-900">{promotion.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {promotion.description.length > 100 
                    ? `${promotion.description.substring(0, 100)}...`
                    : promotion.description
                  }
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Válida hasta: {new Date(promotion.validUntil).toLocaleDateString()}
                </p>
              </div>
              <p className="text-red-600 font-medium">
                Esta acción no se puede deshacer y eliminará permanentemente la promoción.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-600 disabled:opacity-50"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ButtonDelete;
