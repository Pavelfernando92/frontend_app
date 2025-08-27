"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveGameStats } from "../interfaces/live-games.interface";
import { Users, Target, Clock, Award, Gamepad2 } from "lucide-react";

interface GameStatsProps {
  stats: LiveGameStats;
}

export function GameStats({ stats }: GameStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
            <div className="p-2 bg-blue-100/20 rounded-lg">
              <Gamepad2 className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm text-blue-100">Total Números</p>
              <p className="text-xl md:text-2xl font-bold">{stats.totalNumbers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
            <div className="p-2 bg-green-100/20 rounded-lg">
              <Target className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm text-green-100">Disponibles</p>
              <p className="text-xl md:text-2xl font-bold">{stats.availableNumbers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
            <div className="p-2 bg-orange-100/20 rounded-lg">
              <Award className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm text-orange-100">Seleccionados</p>
              <p className="text-xl md:text-2xl font-bold">{stats.takenNumbers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
            <div className="p-2 bg-purple-100/20 rounded-lg">
              <Users className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm text-purple-100">Participando</p>
              <p className="text-xl md:text-2xl font-bold">{stats.participatingUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-600 to-red-700 text-white col-span-2 md:col-span-1">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
            <div className="p-2 bg-red-100/20 rounded-lg">
              <Clock className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs md:text-sm text-red-100">Total Tomados</p>
              <p className="text-xl md:text-2xl font-bold">{stats.totalNumbersTaken}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
