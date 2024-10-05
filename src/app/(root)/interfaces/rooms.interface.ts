import { RoomsNumbers } from "./rooms.number.interface";

export interface RoomsInterface {
  id: number;
  status: RoomStatus;
  numbers: RoomsNumbers[];
  createdAt: string;
  updatedAt: string;
  userWinnerId: number;
  winner: User;
  drawStartTime?: string; // Agregado para la lógica del tiempo
}

export enum RoomStatus {
  ABIERTA = "ABIERTA",
  COMPLETA = "COMPLETA",
  CERRADA = "CERRADA",
}
