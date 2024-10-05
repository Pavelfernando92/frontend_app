import { Badge } from "@/components/ui/badge";
import { RoomsInterface } from "../../interfaces/rooms.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface RoomCardProps {
  room: RoomsInterface;
  availableNumbers: number;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, availableNumbers }) => {
  return (
    <Card className="mb-8 bg-white/10 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-yellow-300">
          ¡Bienvenido a la Sala #{room.id}!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-base sm:text-lg font-semibold text-yellow-100">
              Números Disponibles:
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-300">
              {availableNumbers} / 100
            </p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-semibold text-yellow-100">
              Estado de la Sala:
            </p>
            <Badge
              variant={room.status === "ABIERTA" ? "default" : "secondary"}
              className="text-base sm:text-lg bg-yellow-300 text-[#800020]"
            >
              {room.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
