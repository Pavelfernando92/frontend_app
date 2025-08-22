"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import useUsersStore from "@/store/users.store";
import { useSession } from "next-auth/react";
import useRetiros from "./hooks/useRetiros";

type Withdrawal = {
  id: string;
  userId: string;
  quantity: number;
  createdAt: string;
  user: {
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
  };
};

export default function WithdrawalPage() {
  const [withdrawals, setWithdrawals] = useState<RetirosInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [creditsUser, setCreditsUser] = useState<number>(0); // Update 1
  const { toast } = useToast();
  const { data: session } = useSession();
  const { getUsers, users } = useUsersStore();
  const { createRetiro, getRetiros } = useRetiros();

  const fetchWithdrawals = useCallback(async () => {
    try {
      const allWithdrawals = await getRetiros();
      setWithdrawals(allWithdrawals);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo obtener el historial de retiros",
      });
      setIsLoading(false);
    }
  }, [getRetiros, toast]);

  useEffect(() => {
    if (session?.user?.token) {
      getUsers(session.user.token);
      fetchWithdrawals();
    }
  }, [session, getUsers, fetchWithdrawals]);

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0 || amount > creditsUser) {
      // Update 2
      toast({
        title: "Error en el retiro",
        description:
          amount > creditsUser
            ? "El monto de retiro excede los créditos disponibles"
            : "El monto de retiro no es válido",
        variant: "destructive",
      });
      return;
    }
    const payload = {
      quantity: amount,
      userId: Number(selectedUser),
    };
    try {
      await createRetiro(payload);
      toast({
        variant: "success",
        title: "Retiro exitoso",
        description: `Se ha retirado $${amount} de la cuenta del usuario`,
      });
      setWithdrawalAmount("");
      setSelectedUser("");
      fetchWithdrawals();
      setCreditsUser(creditsUser - amount);
      getUsers(session!.user.token);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error en el retiro",
        description: "Hubo un error al realizar el retiro",
      });
    }
  };

  useEffect(() => {
    if (!selectedUser || users.length === 0) return;
    const userInfo = users.find((user) => user.id === Number(selectedUser));
    if (!userInfo) return;
    setCreditsUser(userInfo.creditos);
  }, [selectedUser, users]);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historial de Retiros</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Realizar Retiro</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Realizar un nuevo retiro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleWithdrawal} className="space-y-4">
              <div>
                <Label htmlFor="user">Usuario</Label>
                <select
                  id="user"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Seleccione un usuario</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {`${user.nombre} ${user.apellido_paterno} ${user.apellido_materno}`}
                    </option>
                  ))}
                </select>
              </div>
              {selectedUser && ( // Update 3
                <div>
                  <Label>Créditos disponibles</Label>
                  <p className="text-sm text-muted-foreground">
                    ${creditsUser.toFixed(2)}
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="Ingrese el monto"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={
                  !selectedUser ||
                  creditsUser <= 0 ||
                  parseFloat(withdrawalAmount) > creditsUser
                } // Update 3
              >
                Confirmar Retiro
              </Button>
              {selectedUser &&
                creditsUser <= 0 && ( // Update 3
                  <p className="text-sm text-red-500">
                    El usuario no tiene créditos suficientes para realizar un
                    retiro.
                  </p>
                )}
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.map((withdrawal) => (
            <TableRow key={withdrawal.id}>
              <TableCell>{withdrawal.id}</TableCell>
              <TableCell>{`${withdrawal.user.nombre} ${withdrawal.user.apellido_paterno} ${withdrawal.user.apellido_materno}`}</TableCell>
              <TableCell>${withdrawal.quantity.toFixed(2)}</TableCell>
              <TableCell>
                {new Date(withdrawal.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
