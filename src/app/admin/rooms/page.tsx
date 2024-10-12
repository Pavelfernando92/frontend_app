"use client";

import { RoomsInterface } from "@/app/(root)/interfaces/rooms.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { RoomsNumbers } from "@/app/(root)/interfaces/rooms.number.interface";

function RoomsPage() {
  const { data: session } = useSession();
  const [room, setRoom] = useState<RoomsInterface>();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedNumber, setSelectedNumber] = useState<RoomsNumbers | null>(
    null
  );

  const getRoom = async () => {
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
  };

  useEffect(() => {
    if (!session) {
      console.log("Cargando sesión");
      return;
    }
    getRoom();
  }, [session]);

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold">Sala en Vivo</h2>
        {!room && <Button onClick={handleClick}>Crear Sala</Button>}
        {room && <Button onClick={reloadRoom}>Recargar Sala</Button>}
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Detalles de la Sala
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <RoomSkeleton />
          ) : room ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm sm:text-base">
                    <strong>ID:</strong> {room.id}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Estado:</strong> {room.status}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Creada:</strong>{" "}
                    {new Date(room.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Actualizada:</strong>{" "}
                    {new Date(room.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm sm:text-base">
                    <strong>Ganador:</strong>{" "}
                    {room.userWinnerId || "Aún no hay ganador"}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Números disponibles:</strong>{" "}
                    {room.numbers.filter((n) => !n.userId).length}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Números seleccionados:</strong>{" "}
                    {room.numbers.filter((n) => n.userId).length}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">
                  Números
                </h3>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {room.numbers
                    .sort((a, b) => a.id - b.id)
                    .map((number) => (
                      <Dialog key={number.id}>
                        <DialogTrigger asChild>
                          <button
                            className={`p-2 text-center text-xs sm:text-sm rounded w-full ${
                              number.userId
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary"
                            }`}
                            onClick={() => handleNumberClick(number)}
                          >
                            {number.valor}
                          </button>
                        </DialogTrigger>
                        {number.userId && (
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Información del Número</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
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

                              {/* Add more user information here if available */}
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center">No hay sala disponible</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RoomSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {[...Array(100)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    </>
  );
}

export default RoomsPage;
