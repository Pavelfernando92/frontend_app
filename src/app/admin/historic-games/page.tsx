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
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RoomsInterface } from "@/app/(root)/interfaces/rooms.interface";
import { useSession } from "next-auth/react";
import lotussApi from "@/lib/axios";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function GameHistory() {
  const [rooms, setRooms] = useState<RoomsInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
  }, [session?.user.token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rooms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rooms.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-10 pb-12">
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-10 pb-12 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <AlertCircle className="mr-2" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-10 pb-12 shadow-lg">
      <CardHeader className="bg-[#800020] text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">
          Histórico de Juegos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#800020] bg-opacity-10">
                <TableHead className="font-bold text-[#800020]">ID</TableHead>
                <TableHead className="font-bold text-[#800020]">
                  Estado
                </TableHead>
                <TableHead className="font-bold text-[#800020]">
                  Ganador
                </TableHead>
                <TableHead className="font-bold text-[#800020]">
                  Creada
                </TableHead>
                <TableHead className="font-bold text-[#800020]">
                  Cerrada
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((room) => (
                <TableRow
                  key={room.id}
                  className="hover:bg-[#800020] hover:bg-opacity-5 transition-colors"
                >
                  <TableCell className="font-medium">{room.id}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        room.status === "CERRADA"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {room.status === "CERRADA" ? "Cerrado" : "Abierto"}
                    </span>
                  </TableCell>
                  <TableCell>{room.winner.email}</TableCell>
                  <TableCell>{formatDate(room.createdAt)}</TableCell>
                  <TableCell>{formatDate(room.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            className="text-[#800020] border-[#800020] hover:bg-[#800020] hover:text-white"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            className="text-[#800020] border-[#800020] hover:bg-[#800020] hover:text-white"
          >
            Siguiente <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
