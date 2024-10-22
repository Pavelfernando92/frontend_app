"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUsersStore from "@/store/users.store";
import { Coins, MessageCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import HistoryGames from "./_components/HistoryGames";
import InviteFriends from "./_components/InviteFriends";
import { useConfig } from "@/app/admin/configuration/hooks/useConfig";
import { useSession } from "next-auth/react";
import lotussApi from "@/lib/axios";
import { UserGameHistoryResponse } from "../interfaces/games-history.interface";

export default function PerfilPage() {
  const { data: session } = useSession();
  const { user } = useUsersStore();
  const { config } = useConfig();

  const [loading, setLoading] = useState<boolean>(false);
  const [games, setGames] = useState<UserGameHistoryResponse[]>([]);
  const [winAtLeastOne, setWinAtLeastOne] = useState<boolean>(false);

  useEffect(() => {
    if (!games || games.length === 0 || !user) return;

    setWinAtLeastOne(games.some((game) => game.winner.id === user.id));
  }, [games]);

  console.log(winAtLeastOne);

  useEffect(() => {
    if (!session) {
      return;
    }
    const getHistoryGames = async () => {
      try {
        setLoading(true);
        const res = await lotussApi(`usuarios/${session?.user.id}/history`, {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        });
        setGames(res.data);
      } catch (error) {
        console.log(`Error al obtener el historial de juegos: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    getHistoryGames();
  }, [session]);

  if (!user) {
    return null;
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = "+525650234852";
    const message = encodeURIComponent("Solicito un retiro");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const canRequestWithdrawal =
    !loading &&
    games.length > 0 &&
    config?.prizeAmount &&
    winAtLeastOne &&
    user.creditos >= config.prizeAmount;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="col-span-1 md:col-span-2 bg-[#FFFFFF]/10 backdrop-blur-lg text-white">
          <CardHeader>
            <CardTitle className="text-[#FFD700]">Perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage
                className="object-cover"
                src={user.profilePicture}
                alt="User Avatar"
              />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-2">
              {user.nombre} {user.apellido_paterno}
            </h2>
            <p className="text-[#FFD700] mb-4">
              Miembro desde:{" "}
              {new Date(user.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {canRequestWithdrawal && (
              <Button
                onClick={handleWhatsAppClick}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Solicitar Retiro por WhatsApp
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-[#FFFFFF]/10 backdrop-blur-lg text-white">
          <CardHeader>
            <CardTitle className="text-[#FFD700]">
              Descripción general de la cuenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Coins className="mr-2 h-5 w-5 text-[#FFD700]" />
                <div>
                  <p className="text-sm">COINS Disponibles</p>
                  <p className="text-2xl font-bold">{user.creditos}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 bg-[#FFFFFF]/10">
          <TabsTrigger value="history" className="text-[#FFD700]">
            Historial de Juegos
          </TabsTrigger>
          <TabsTrigger value="invite" className="text-[#FFD700]">
            Invita Amigos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <HistoryGames />
        </TabsContent>
        <TabsContent value="invite">
          <InviteFriends />
        </TabsContent>
      </Tabs>
    </main>
  );
}
