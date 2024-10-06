"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGameConfig from "./hooks/useGameConfig";

const ConfiguracionPage: React.FC = () => {
  const {
    cantidadGanancia,
    monedasRequeridas,
    numerosTotales,
    invitationsForReward,
    invitationReward,
    manejarEnvio,
    isEditing,
    toggleEditing,
    configExist,
    handleInputChange,
  } = useGameConfig();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Configuración</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={manejarEnvio} className="space-y-6">
            {/* Sección de Ganancia */}
            <section>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cantidadGanancia" className="text-lg">
                    Cantidad de Ganancia
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Define la cantidad de ganancia que los jugadores recibirán.
                  </p>
                  <Input
                    id="cantidadGanancia"
                    type="number"
                    className="sm:text-lg p-2"
                    value={cantidadGanancia}
                    onChange={(e) =>
                      handleInputChange("cantidadGanancia", e.target.value)
                    }
                    min="1"
                    required
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </section>

            {/* Sección de Monedas */}
            <section>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monedasRequeridas" className="text-lg">
                    Monedas Requeridas para Jugar
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Especifica cuántas monedas son necesarias para que un
                    jugador participe.
                  </p>
                  <Input
                    id="monedasRequeridas"
                    type="number"
                    className="text-lg p-2"
                    value={monedasRequeridas}
                    onChange={(e) =>
                      handleInputChange("monedasRequeridas", e.target.value)
                    }
                    min="1"
                    required
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </section>

            {/* Sección de Números */}
            <section>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="numerosTotales" className="text-lg">
                    Números Totales en la Sala
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Determina cuántos números estarán disponibles en cada sala
                    de juego.
                  </p>
                  <Input
                    id="numerosTotales"
                    type="number"
                    className="sm:text-lg p-2"
                    value={numerosTotales}
                    onChange={(e) =>
                      handleInputChange("numerosTotales", e.target.value)
                    }
                    min="1"
                    required
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </section>

            {/* Sección de Referidos */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="invitationsForReward" className="text-lg">
                    Invitaciones necesarias
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Especifica cuántas invitaciones debe aceptar un jugador para
                    obtener una recompensa.
                  </p>
                  <Input
                    id="invitationsForReward"
                    type="number"
                    className="sm:text-lg p-2"
                    value={invitationsForReward}
                    onChange={(e) =>
                      handleInputChange("invitationsForReward", e.target.value)
                    }
                    min="1"
                    required
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invitationReward" className="text-lg">
                    Recompensa por invitaciones aceptadas
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Define cuántas monedas recibirán los jugadores por cada
                    invitación aceptada.
                  </p>
                  <Input
                    id="invitationReward"
                    type="number"
                    className="sm:text-lg p-2"
                    value={invitationReward}
                    onChange={(e) =>
                      handleInputChange("invitationReward", e.target.value)
                    }
                    min="1"
                    required
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </section>

            {/* Botones */}
            {isEditing && (
              <Button type="submit" className="w-full text-lg py-3">
                Guardar Configuración
              </Button>
            )}
          </form>

          {!isEditing && configExist && (
            <Button
              variant="outline"
              onClick={toggleEditing}
              className="w-full text-lg mt-4 py-3"
            >
              Editar Configuración
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracionPage;
