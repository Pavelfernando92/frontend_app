"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUsersStore from "@/store/users.store";
import { Coins, History, UserPlus } from "lucide-react";
import React, { useState } from "react";
import HistoryGames from "./_components/HistoryGames";

export default function PerfilPage() {
  const { user } = useUsersStore();
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the invitation
    alert(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
  };

  if (!user) {
    return;
  }

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
            <p className="text-[#FFD700]">
              Miembro desde:{" "}
              {new Date(user.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
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
            Game History
          </TabsTrigger>
          <TabsTrigger value="invite" className="text-[#FFD700]">
            Invite Friends
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <HistoryGames />
        </TabsContent>
        <TabsContent value="invite">
          <Card className="bg-[#FFFFFF]/10 backdrop-blur-lg text-white">
            <CardHeader>
              <CardTitle className="text-[#FFD700]">Invita Amigos</CardTitle>
              <CardDescription>
                Gana premios invitando a tus amigos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="inviteEmail">Friend's Email</Label>
                  <Input
                    id="inviteEmail"
                    placeholder="Enter your friend's email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-[#FFFFFF]/20 text-white placeholder-[#FFFFFF]/50"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#FFD700] text-[#800020] hover:bg-[#FFFFFF] hover:text-[#800020]"
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Send Invitation
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
