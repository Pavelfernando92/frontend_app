import { UserGameHistoryResponse } from "../../interfaces/games-history.interface";

interface Props {
  game: UserGameHistoryResponse;
  id: number;
}
export const GameStatus = ({ game, id }: Props) => {
  const isWinner = game.winner?.id === id;
  const statusColor = !game.winner
    ? "text-yellow-400"
    : isWinner
    ? "text-green-400"
    : "text-red-400";
  const statusText = !game.winner
    ? "EN PROGRESO"
    : isWinner
    ? "Ganado"
    : "Perdido";

  return <span className={`${statusColor} font-semibold`}>{statusText}</span>;
};
