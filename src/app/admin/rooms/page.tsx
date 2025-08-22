"use client";

import { RoomsInterface } from "@/app/(root)/interfaces/rooms.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { RoomsNumbers } from "@/app/(root)/interfaces/rooms.number.interface";
import { RefreshCw, Users, Clock, Award } from "lucide-react";
import { InfoItem } from "./_components/InfoItem";
import { RoomSkeleton } from "./_components/RoomSkeleton";

function RoomsPage() {
  const { data: session } = useSession();
  const [room, setRoom] = useState<RoomsInterface>();
  const [loading, setLoading] = useState(true);
  const [selectedNumber, setSelectedNumber] = useState<RoomsNumbers | null>(
    null
  );

  const getRoom = useCallback(async () => {
    setLoading(true);
    try {
      const res = await lotussApi("rooms", {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      setRoom(res.data[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [session?.user.token]);

  useEffect(() => {
    if (!session) {
      console.log("Cargando sesión");
      return;
    }
    getRoom();
  }, [session, getRoom]);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await lotussApi.post(
        "rooms",
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      setRoom(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const reloadRoom = () => {
    getRoom();
  };

  const handleNumberClick = (number: RoomsNumbers) => {
    if (number.userId) {
      setSelectedNumber(number);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold">Sala en Vivo</h2>
        {!room && (
          <Button onClick={handleClick} variant="outline">
            Crear Sala
          </Button>
        )}
        {room && (
          <Button onClick={reloadRoom} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Recargar Sala
          </Button>
        )}
      </div>

      <Card className="w-full shadow-lg overflow-hidden">
        <CardHeader className="bg-[#800020] text-white">
          <CardTitle className="text-xl sm:text-2xl">
            Detalles de la Sala
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 bg-gradient-to-br from-[#800020] to-[#4a0012] text-white">
          {loading ? (
            <RoomSkeleton />
          ) : room ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <InfoItem
                    icon={<Clock className="h-5 w-5" />}
                    label="ID"
                    value={String(room.id)}
                  />
                  <InfoItem
                    icon={<Users className="h-5 w-5" />}
                    label="Estado"
                    value={room.status}
                  />
                  <InfoItem
                    icon={<Clock className="h-5 w-5" />}
                    label="Creada"
                    value={new Date(room.createdAt).toLocaleString()}
                  />
                  <InfoItem
                    icon={<Clock className="h-5 w-5" />}
                    label="Actualizada"
                    value={new Date(room.updatedAt).toLocaleString()}
                  />
                </div>
                <div className="space-y-4">
                  <InfoItem
                    icon={<Award className="h-5 w-5" />}
                    label="Ganador"
                    value={
                      room.userWinnerId !== null
                        ? String(room.userWinnerId)
                        : "Aún no hay ganador"
                    }
                  />
                  <InfoItem
                    icon={<Users className="h-5 w-5" />}
                    label="Números disponibles"
                    value={room.numbers
                      .filter((n) => !n.userId)
                      .length.toString()}
                  />
                  <InfoItem
                    icon={<Users className="h-5 w-5" />}
                    label="Números seleccionados"
                    value={room.numbers
                      .filter((n) => n.userId)
                      .length.toString()}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
                  Números
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {room.numbers
                    .sort((a, b) => a.id - b.id)
                    .map((number) => (
                      <Dialog key={number.id}>
                        <DialogTrigger asChild>
                          <button
                            className={`p-2 text-center text-xs sm:text-sm rounded-full w-full transition-all duration-300 ${
                              number.userId
                                ? "bg-white text-[#800020] hover:bg-gray-200"
                                : "bg-[#800020]/30 text-white hover:bg-[#800020]/50"
                            }`}
                            onClick={() => handleNumberClick(number)}
                          >
                            {number.valor}
                          </button>
                        </DialogTrigger>
                        {number.userId && (
                          <DialogContent className="bg-white">
                            <DialogHeader>
                              <DialogTitle className="text-2xl text-[#800020]">
                                Información del Número
                              </DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-2 text-gray-700">
                              <p>
                                <strong>Número:</strong> {number.valor}
                              </p>
                              <p>
                                <strong>Usuario ID:</strong> {number.userId}
                              </p>
                              <p>
                                <strong>Usuario Email:</strong>{" "}
                                {number.user.email}
                              </p>
                              <p>
                                <strong>Usuario Teléfono:</strong>{" "}
                                {number.user.telefono}
                              </p>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-xl text-white">
              No hay sala disponible
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default RoomsPage;
