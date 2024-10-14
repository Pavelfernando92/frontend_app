"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import useUsersStore from "@/store/users.store";
import { useSession } from "next-auth/react";
import useRetiros from "./hooks/useRetiros";
import CardInfo from "./_components/card-info";
import CardHistory from "./_components/card-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function WithdrawalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalHistory, setWithdrawalHistory] = useState<
    RetirosInterface[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const { data: session, status } = useSession();
  const { getUsers, users } = useUsersStore();
  const { createRetiro, getRetiros } = useRetiros();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.token) {
      getUsers(session.user.token);
      setIsLoading(false);
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, session, getUsers]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const normalizePhoneNumber = (phone: string) => {
      return phone.replace(/^\+?52?/, "").slice(-10);
    };

    const user: User | undefined = users.find(
      (u) =>
        u.email === searchTerm ||
        normalizePhoneNumber(u.telefono) === normalizePhoneNumber(searchTerm)
    );
    if (user) {
      setFoundUser(user);
      toast({
        title: "Usuario encontrado",
        description: `Se ha encontrado a ${user.nombre} ${user.apellido_paterno} ${user.apellido_materno}`,
      });

      try {
        const history = await getRetiros(user.id);
        setWithdrawalHistory(history);
      } catch (error) {
        console.error("Error fetching withdrawal history:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo obtener el historial de retiros",
        });
      }
    } else {
      setFoundUser(null);
      setWithdrawalHistory([]);
      toast({
        title: "Usuario no encontrado",
        description: "No se ha encontrado ningún usuario con esos datos",
        variant: "destructive",
      });
    }
    setIsSearching(false);
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (!foundUser) {
      return;
    }
    if (isNaN(amount) || amount <= 0 || amount > foundUser.creditos) {
      toast({
        title: "Error en el retiro",
        description: "El monto de retiro no es válido",
        variant: "destructive",
      });
      return;
    }
    const payload = {
      quantity: amount,
      userId: foundUser.id,
    };
    try {
      await createRetiro(payload);
      toast({
        variant: "success",
        title: "Retiro exitoso",
        description: `Se ha retirado $${amount} de la cuenta de ${foundUser.nombre}`,
      });
      setFoundUser({ ...foundUser, creditos: foundUser.creditos - amount });
      setWithdrawalAmount("");
      getUsers(session!.user.token);

      const updatedHistory = await getRetiros(foundUser.id);
      setWithdrawalHistory(updatedHistory);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error en el retiro",
        description: "Hubo un error al realizar el retiro",
      });
    }
  };

  const handleChangeWithDrawalAmount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWithdrawalAmount(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 xl:px-16">
        <Skeleton className="h-8 w-64 mb-4 lg:mb-6" />
        <Card className="w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 xl:px-16">
      <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
        Página de Retiros
      </h1>

      <Card className="w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg lg:text-2xl">Buscar Usuario</CardTitle>
          <CardDescription className="text-base lg:text-lg">
            Ingrese el número de teléfono o email del usuario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="searchTerm" className="text-sm lg:text-base">
                Teléfono o Email
              </Label>
              <Input
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.trim())}
                placeholder="Ingrese teléfono o email"
                className="w-full text-sm lg:text-base"
              />
            </div>
            <Button
              type="submit"
              className="w-full sm:w-auto lg:text-lg"
              disabled={isSearching}
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isSearching ? (
        <Card className="w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto mt-8 lg:mt-12">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ) : foundUser ? (
        <Card className="w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto mt-8 lg:mt-12">
          <CardHeader>
            <CardTitle className="text-lg lg:text-2xl">
              Información del Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="form" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form" className="md:text-xl">
                  Realizar Retiro
                </TabsTrigger>
                <TabsTrigger value="history" className="md:text-xl">
                  Historial de Retiros
                </TabsTrigger>
              </TabsList>
              <TabsContent value="form" className="mt-6">
                <CardInfo
                  user={foundUser}
                  handleWithdrawal={handleWithdrawal}
                  withdrawalAmount={withdrawalAmount}
                  handleChangeWithDrawalAmount={handleChangeWithDrawalAmount}
                />
              </TabsContent>
              <TabsContent value="history" className="mt-6">
                <CardHistory withdrawalHistory={withdrawalHistory} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
