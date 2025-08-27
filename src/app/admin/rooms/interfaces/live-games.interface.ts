export interface LiveGameUser {
  id: number;
  email: string;
  password: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  birthday: string;
  creditos: number;
  acceptedInvitations: number;
  profilePicture: string;
  publicId: string;
  role: string;
  status: boolean;
  ambassadorId: number | null;
  dateJoinGroup: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LiveGameNumber {
  id: number;
  valor: number;
  roomId: number;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
  user: LiveGameUser | null;
}

export interface LiveGame {
  id: number;
  status: string;
  userWinnerId: number | null;
  drawStartTime: string | null;
  createdAt: string;
  updatedAt: string;
  numbers: LiveGameNumber[];
}

export interface LiveGameStats {
  totalNumbers: number;
  availableNumbers: number;
  takenNumbers: number;
  participatingUsers: number;
  totalNumbersTaken: number;
}
