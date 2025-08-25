export interface WinnerInterface {
  id: number;
  name: string;
  apellido: string;
  image: string;
  winningNumber: number;
}

// Interfaces para los últimos ganadores en la página principal
export interface Winner {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  profilePicture: string;
  email: string;
}

export interface WinnerRoom {
  id: number;
  status: string;
  userWinnerId: number;
  drawStartTime: string;
  createdAt: string;
  updatedAt: string;
  winner: Winner;
}
