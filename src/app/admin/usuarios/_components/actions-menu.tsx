import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Gamepad2, MoreHorizontal, Phone, UserSearch } from "lucide-react";
import ButtonDelete from "./button-delete";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import lotussApi from "@/lib/axios";
import { signOut, useSession } from "next-auth/react";
import useUsersStore from "@/store/users.store";

type Props = {
  toast: any;
  user: User;
  router: any;
};

const ActionsMenu = ({ toast, user, router }: Props) => {
  const { data: session, status } = useSession();
  const { getUsers } = useUsersStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [coins, setCoins] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onChangeCoins = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoins(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const coinsToNumber = Number(coins);
    const userLastCoins = user.creditos;

    const totalCoins = userLastCoins + coinsToNumber;

    if (Number.isNaN(coinsToNumber) || !coinsToNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Los coins deben ser números enteros`,
      });
      return;
    }
    if (!session || status !== "authenticated") {
      signOut();
      return;
    }
    setLoading(true);
    try {
      await lotussApi.put(
        `/usuarios/${user.id}`,
        {
          creditos: totalCoins,
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      toast({
        variant: "success",
        title: "Guardado Correctamente",
        description: `Se le asignaron correctamente los COINS al usuario`,
      });
      getUsers(session.user.token);
      setIsDialogOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Gamepad2 className="mr-2 h-4 w-4" />
              Asignar COINS
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Asignar COINS</DialogTitle>
              <DialogDescription>
                El usuario actualmente tiene {user.creditos} COINS
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="coins" className="text-right">
                  COINS
                </Label>
                <Input
                  id="coins"
                  className="col-span-2"
                  value={coins}
                  onChange={onChangeCoins}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit} disabled={loading}>
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ButtonDelete user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsMenu;
