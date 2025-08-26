"use client";

import { useState, useEffect } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SortAsc, SortDesc, Filter, X } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true, // Ordenar por fecha de creación descendente por defecto
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      sorting,
    },
    enableSorting: true,
  });

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setColumnFilters([]);
  };

  // Función para obtener el valor de un filtro específico
  const getFilterValue = (columnId: string) => {
    return (table.getColumn(columnId)?.getFilterValue() as string) ?? "";
  };

  // Función para establecer el valor de un filtro específico
  const setFilterValue = (columnId: string, value: string) => {
    table.getColumn(columnId)?.setFilterValue(value);
  };

  // Función para filtrar por nombre completo (nombre + apellidos)
  const handleFullNameFilter = (value: string) => {
    // Limpiar filtros individuales de nombre
    table.getColumn("nombre")?.setFilterValue("");
    table.getColumn("apellido_paterno")?.setFilterValue("");
    table.getColumn("apellido_materno")?.setFilterValue("");
    
    // Aplicar filtro al nombre completo
    if (value) {
      table.getColumn("nombre")?.setFilterValue(value);
    }
  };

  return (
    <div>
      {/* Barra de filtros */}
      <div className="space-y-4 py-4">
        {/* Filtros principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Filtrar por email..."
                value={getFilterValue("email")}
                onChange={(event) => setFilterValue("email", event.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtro por Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Filtrar por nombre..."
                value={getFilterValue("nombre")}
                onChange={(event) => setFilterValue("nombre", event.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtro por Apellido Paterno */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Apellido Paterno</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Filtrar por apellido..."
                value={getFilterValue("apellido_paterno")}
                onChange={(event) => setFilterValue("apellido_paterno", event.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtro por Apellido Materno */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Apellido Materno</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Filtrar por apellido..."
                value={getFilterValue("apellido_materno")}
                onChange={(event) => setFilterValue("apellido_materno", event.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>


        {/* Controles de filtros */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {sorting[0]?.id === "createdAt" && (
              <>
                {sorting[0].desc ? (
                  <SortDesc className="h-4 w-4 text-[#800020]" />
                ) : (
                  <SortAsc className="h-4 w-4 text-[#800020]" />
                )}
                <span>Ordenado por fecha de registro</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {table.getFilteredRowModel().rows.length} de {data.length} usuarios
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {columnFilters.length > 0 ? "No se encontraron resultados para los filtros aplicados." : "No hay usuarios registrados."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-gray-600">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          de {table.getFilteredRowModel().rows.length} resultados
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
