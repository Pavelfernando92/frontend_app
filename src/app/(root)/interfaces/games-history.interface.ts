import { RoomsInterface } from "./rooms.interface";

export interface UserGameHistoryResponse {
  userId: number; // User ID
  nombre: string; // User's first name
  apellido_paterno: string; // User's last name
  creditos: number; // User's available credits
  salasParticipadas: RoomsInterface[]; // Array of game rooms the user participated in
}
