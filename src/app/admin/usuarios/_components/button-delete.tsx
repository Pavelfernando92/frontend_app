"use client";
import React from "react";
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
import { Trash } from "lucide-react";
import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import useUsersStore from "@/store/users.store";
import { cn } from "@/lib/utils";

type Props = {
  user: User;
};

const ButtonDelete = ({ user }: Props) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { getUsers } = useUsersStore(); // Destructuramos el método getUsers

  const handleStatusUser = async (user: User) => {
    try {
      if (!session?.user.token) {
        throw new Error("No hay un token disponible");
      }

      await lotussApi.put(
        `/usuarios/${user.id}`,
        {
          status: user.status ? false : true,
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      toast({
        title: `Usuario ${user.status ? "Deshabilitado" : "Habilitado"}`,
        description: `El usuario se ${
          user.status ? "deshabilito" : "habilito"
        } correctamente`,
        variant: "success",
      });

      // Solo llamamos a getUsers si el token está definido
      getUsers(session.user.token);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Hubo un error al deshabilitar el usuario",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash className="mr-2 h-4 w-4" />
          {user.status ? "Deshabilitar Usuario" : "Habilitar Usuario"}
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            {user.status
              ? "Esto deshabilitará al usuario de la aplicación."
              : "Esto habilitará al usuario de nuevo a la aplicación"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              user.status
                ? "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
                : "bg-green-700 hover:bg-green-600 shadow-sm"
            )}
            onClick={() => handleStatusUser(user)}
          >
            {user.status ? "Deshabilitar" : "Habilitar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ButtonDelete;
