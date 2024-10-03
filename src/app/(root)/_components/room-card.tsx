import React from "react";
import { RoomsInterface, RoomStatus } from "../interfaces/rooms.interface";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Hash } from "lucide-react";

type Props = {
  room: RoomsInterface;
};

const RoomCard = ({ room }: Props) => {
  const getNumbersAvailable = () => {
    return room.numbers.filter((num) => num.userId === null).length;
  };

  const statusColor =
    room.status === RoomStatus.ABIERTA ? "bg-green-500" : "bg-red-500";

  return (
    <Card className="w-[350px] mt-4 overflow-hidden">
      <div className={`h-2 ${statusColor}`} />
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Sala #{room.id}</CardTitle>
          <Badge
            variant={
              room.status === RoomStatus.ABIERTA ? "default" : "destructive"
            }
          >
            {room.status}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Participa en esta sala de números
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Números disponibles:
          </span>
          <span className="font-semibold">
            {getNumbersAvailable()}/{room.numbers.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Hash className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Total de números:
          </span>
          <span className="font-semibold">{room.numbers.length}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline">Ingresar</Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
