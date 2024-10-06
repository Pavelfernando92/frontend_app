"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGameConfig from "./hooks/useGameConfig";
import { Pencil } from "lucide-react";

const PaginaConfiguracion = () => {
  const {
    cantidadGanancia,
    setCantidadGanancia,
    monedasRequeridas,
    setMonedasRequeridas,
    numerosTotales,
    setNumerosTotales,
    manejarEnvio,
    isEditing,
    toggleEditing, // Añadir toggleEditing aquí
    configExist,
  } = useGameConfig();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Panel de Administración</h1>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex  flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Configuración del Juego
          </CardTitle>
          {configExist && (
            <Button
              type="button"
              onClick={toggleEditing}
              className="flex items-center"
            >
              <Pencil className="h-5 w-5 mr-2" />
              {isEditing ? "Bloquear" : "Editar"}
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={manejarEnvio} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cantidadGanancia" className="text-lg">
                  Cantidad de Ganancia
                </Label>
                <Input
                  id="cantidadGanancia"
                  type="text"
                  value={cantidadGanancia}
                  onChange={(e) => setCantidadGanancia(e.target.value)}
                  min="1"
                  required
                  className="text-lg p-2"
                  disabled={!isEditing} // Deshabilitar si no se está editando
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monedasRequeridas" className="text-lg">
                  Monedas Requeridas para Jugar
                </Label>
                <Input
                  id="monedasRequeridas"
                  type="text"
                  value={monedasRequeridas}
                  onChange={(e) => setMonedasRequeridas(e.target.value)}
                  min="1"
                  required
                  className="text-lg p-2"
                  disabled={!isEditing} // Deshabilitar si no se está editando
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numerosTotales" className="text-lg">
                Números Totales en la Sala
              </Label>
              <Input
                id="numerosTotales"
                type="text"
                value={numerosTotales}
                onChange={(e) => setNumerosTotales(e.target.value)}
                min="1"
                required
                className="text-lg p-2"
                disabled={!isEditing} // Deshabilitar si no se está editando
              />
            </div>
            {isEditing && (
              <Button type="submit" className="w-full text-lg py-3">
                Guardar Configuración
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaginaConfiguracion;
