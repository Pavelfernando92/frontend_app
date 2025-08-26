"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Coins, TrendingUp, History } from "lucide-react";
import { useCreditsHistory } from "../hooks/useCreditsHistory";
import { HistoricCoinsResponse, CreditsHistoryFilters } from "../interfaces/credits-history.interface";
import { format } from "date-fns";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface CreditsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

export default function CreditsHistoryModal({ isOpen, onClose, userId, userName }: CreditsHistoryModalProps) {
  const { fetchCreditsHistory, isLoading, error, clearError } = useCreditsHistory();
  const [historyData, setHistoryData] = useState<HistoricCoinsResponse | null>(null);
  const [filters, setFilters] = useState<CreditsHistoryFilters>({
    page: 1,
    limit: 10,
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    if (isOpen && userId) {
      loadHistory();
    }
  }, [isOpen, userId, filters]);

  const loadHistory = async () => {
    const data = await fetchCreditsHistory(userId, filters);
    if (data) {
      setHistoryData(data);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDateFilter = () => {
    setFilters(prev => ({ ...prev, page: 1 })); // Resetear a primera página
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      startDate: "",
      endDate: ""
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount: number) => {
    const isPositive = amount > 0;
    return (
      <span className={`font-mono ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{amount.toLocaleString()}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#800020] to-[#A00030] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Historial de Créditos</h2>
                <p className="text-red-100">Usuario: {userName}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose} className="text-black border-white hover:bg-white/20">
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Filtros */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Filtros de Fecha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Fecha de Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                                  <div className="flex gap-2">
                    <Button onClick={handleDateFilter} className="flex-1 bg-[#800020] hover:bg-[#A00030]">
                      Aplicar Filtros
                    </Button>
                    <Button variant="outline" onClick={clearFilters}>
                      Limpiar
                    </Button>
                  </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumen */}
          {historyData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-[#800020]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Transacciones</p>
                      <p className="text-2xl font-bold text-[#800020]">{historyData.totalTransactions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Coins className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Créditos Agregados</p>
                      <p className="text-2xl font-bold text-green-600">
                        +{historyData.totalCoinsAdded.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <History className="h-6 w-6 text-[#800020]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Página Actual</p>
                      <p className="text-2xl font-bold text-[#800020]">
                        {historyData.page} de {Math.ceil(historyData.totalTransactions / historyData.limit)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
              <Button variant="outline" size="sm" onClick={clearError} className="mt-2 border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-white">
                Reintentar
              </Button>
            </div>
          )}

          {/* Tabla de Transacciones */}
          <Card>
            <CardHeader>
              <CardTitle>Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800020]"></div>
                  <span className="ml-2">Cargando transacciones...</span>
                </div>
              ) : historyData?.transactions && historyData.transactions.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Usuario ID</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyData.transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono">{transaction.id}</TableCell>
                          <TableCell>{formatAmount(transaction.amount)}</TableCell>
                          <TableCell className="font-mono">{transaction.userId}</TableCell>
                          <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.amount > 0 ? "default" : "destructive"}>
                              {transaction.amount > 0 ? "Agregado" : "Descontado"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Paginación */}
                  {historyData.totalTransactions > historyData.limit && (
                    <div className="mt-4 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => handlePageChange(historyData.page - 1)}
                              className={historyData.page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>

                                                      {Array.from({ length: Math.min(5, Math.ceil(historyData.totalTransactions / historyData.limit)) }, (_, i) => {
                              const page = i + 1;
                              return (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => handlePageChange(page)}
                                    isActive={page === historyData.page}
                                    className="cursor-pointer data-[state=active]:bg-[#800020] data-[state=active]:text-white data-[state=active]:border-[#800020]"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() => handlePageChange(historyData.page + 1)}
                              className={historyData.page >= Math.ceil(historyData.totalTransactions / historyData.limit) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-4 text-[#800020]" />
                  <p>No se encontraron transacciones para este usuario</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
