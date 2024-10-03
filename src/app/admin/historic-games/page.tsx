"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomsInterface } from "@/app/(root)/interfaces/rooms.interface";
import { useSession } from "next-auth/react";
import lotussApi from "@/lib/axios";

export default function GameHistory() {
  const [rooms, setRooms] = useState<RoomsInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await lotussApi("rooms/history-rooms", {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        });
        const data = response.data;
        setRooms(data);
      } catch (err) {
        setError(
          "Error al cargar los datos. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Histórico de Juegos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Ganador</TableHead>
              <TableHead>Creada</TableHead>
              <TableHead>Cerrada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.id}</TableCell>
                <TableCell>{room.status}</TableCell>
                <TableCell>{room.winner.email}</TableCell>
                <TableCell>{formatDate(room.createdAt)}</TableCell>
                <TableCell>{formatDate(room.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
