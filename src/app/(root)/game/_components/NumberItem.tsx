import { RoomsNumbers } from "../../interfaces/rooms.number.interface";

// NumberItem.tsx
export interface NumberItemProps {
  number: RoomsNumbers;
  user: User;
  roomId: number;
  assignNumber: (numberId: number, roomId: number) => void;
}

const NumberItem: React.FC<NumberItemProps> = ({
  number,
  user,
  roomId,
  assignNumber,
}) => {
  const isUserNumber = number.userId === user.id;
  const isTaken = !!number.userId;
  const isDisabled = user.creditos < 100 || isTaken;

  return (
    <div
      className={`aspect-square flex items-center justify-center rounded-md text-xs sm:text-sm font-medium cursor-pointer ${
        isUserNumber
          ? "bg-yellow-300 text-[#800020]"
          : isTaken
          ? "bg-red-500 text-transparent cursor-not-allowed"
          : isDisabled
          ? "bg-gray-300 text-transparent opacity-50 cursor-not-allowed"
          : "bg-gray-300 text-transparent hover:bg-yellow-100"
      } transition-all duration-300 ease-in-out hover:scale-105`}
      onClick={() => !isDisabled && assignNumber(number.id, roomId)}
    >
      {isUserNumber ? number.valor : ""}
    </div>
  );
};

export default NumberItem;
