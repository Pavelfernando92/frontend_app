"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LiveGameNumber } from "../interfaces/live-games.interface";
import { Gamepad2, User, Clock } from "lucide-react";

interface NumbersGridProps {
  numbers: LiveGameNumber[];
}

export function NumbersGrid({ numbers }: NumbersGridProps) {
  const sortedNumbers = numbers.sort((a, b) => a.valor - b.valor);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5" />
          Grilla de Números ({numbers.length} total)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1 sm:gap-2">
          {sortedNumbers.map((number) => (
            <div
              key={number.id}
              className={`relative p-1 sm:p-2 text-center text-xs sm:text-sm rounded-lg transition-all duration-300 ${
                number.userId
                  ? "bg-[#800020] text-white shadow-lg"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              <div className="font-medium">{number.valor}</div>
              
              {number.userId && number.user && (
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                  <Avatar className="h-4 w-4 sm:h-6 sm:w-6 border-2 border-white">
                    <AvatarImage src={number.user.profilePicture} alt={number.user.nombre} />
                    <AvatarFallback className="bg-white text-[#800020] text-xs">
                      {number.user.nombre.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Leyenda</h4>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#800020] rounded flex-shrink-0"></div>
              <span>Número seleccionado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded flex-shrink-0"></div>
              <span>Número disponible</span>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              {numbers.filter(n => !n.userId).length}
            </div>
            <div className="text-xs sm:text-sm text-green-600">Disponibles</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-[#800020] text-white rounded-lg">
            <div className="text-lg sm:text-2xl font-bold">
              {numbers.filter(n => n.userId).length}
            </div>
            <div className="text-xs sm:text-sm">Seleccionados</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
