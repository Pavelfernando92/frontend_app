"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LiveGameNumber } from "../interfaces/live-games.interface";
import { User, Phone, Mail, Coins } from "lucide-react";

interface ParticipatingUsersProps {
  participatingUsers: Array<{
    user: any;
    numbers: LiveGameNumber[];
  }>;
}

export function ParticipatingUsers({ participatingUsers }: ParticipatingUsersProps) {
  if (participatingUsers.length === 0) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No hay usuarios participando en este momento</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Usuarios Participando</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {participatingUsers.map(({ user, numbers }) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={user.profilePicture} alt={user.nombre} />
                    <AvatarFallback className="bg-[#800020] text-white">
                      {user.nombre.charAt(0)}{user.apellido_paterno.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {user.nombre} {user.apellido_paterno} {user.apellido_materno}
                    </CardTitle>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 mt-1">
                      {numbers.length} {numbers.length === 1 ? 'número' : 'números'}
                    </Badge>
                  </div>
                </div>
                
                {/* Información de contacto en mobile se muestra debajo */}
                <div className="sm:hidden w-full pt-2 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{user.telefono}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <Coins className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">{user.creditos} créditos</span>
                  </div>
                </div>
              </div>
              
              {/* Información de contacto en desktop se muestra al lado */}
              <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600 mt-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="truncate max-w-[200px]">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="truncate">{user.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  <span className="font-medium">{user.creditos}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Números seleccionados:</span>
                  <span className="text-sm text-gray-500">Total: {numbers.length}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {numbers.map((number) => (
                    <div
                      key={number.id}
                      className="bg-[#800020] text-white text-center py-2 px-2 rounded-lg text-sm font-medium"
                    >
                      {number.valor}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 text-center pt-2 border-t">
                  Seleccionado el {new Date(numbers[0]?.updatedAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
