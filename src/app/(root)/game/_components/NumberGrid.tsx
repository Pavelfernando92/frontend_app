// NumberGrid.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import NumberItem from "./NumberItem";
import { RoomsNumbers } from "../../interfaces/rooms.number.interface";
import { RoomsInterface } from "../../interfaces/rooms.interface";

export interface NumberGridProps {
  user: User;
  room: RoomsInterface;
  assignNumber: (numberId: number, roomId: number) => void;
}

const NumberGrid: React.FC<NumberGridProps> = ({
  user,
  room,
  assignNumber,
}) => {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-yellow-300">
          Números
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {user &&
            room.numbers
              .sort((a: RoomsNumbers, b: RoomsNumbers) => a.id - b.id)
              .map((number: RoomsNumbers) => (
                <NumberItem
                  key={number.id}
                  number={number}
                  user={user}
                  roomId={room.id}
                  assignNumber={assignNumber}
                />
              ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NumberGrid;
