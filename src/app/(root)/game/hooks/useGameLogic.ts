import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import lotussApi from "@/lib/axios";
import useUsersStore from "@/store/users.store";

import { redirect } from "next/navigation";
import { RoomsInterface } from "../../interfaces/rooms.interface";
import { WinnerInterface } from "../../interfaces/winner.interface";

let socket: Socket;

export const useGameLogic = () => {
  const { data: session, status } = useSession();
  const { user, setUser } = useUsersStore();
  const [room, setRoom] = useState<RoomsInterface | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [errorModalState, setErrorModalState] = useState({
    isOpen: false,
    message: "",
  });
  const [winnerModalState, setWinnerModalState] = useState<{
    isOpen: boolean;
    winner: WinnerInterface | null;
  }>({
    isOpen: false,
    winner: null,
  });
  const [isDrawStartingModalOpen, setIsDrawStartingModalOpen] = useState(false);

  useEffect(() => {
    if (session && status === "authenticated") {
      fetchRoomData(session.user.token);

      // Initialize socket connection
      socket = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET!);

      // Join room and listen for events
      socket.emit("joinRoom", room?.id);

      socket.on("roomData", (roomData: RoomsInterface) => {
        setRoom(roomData);
      });

      socket.on("numberAssigned", (updatedNumber) => {
        setRoom((prevRoom) => {
          if (!prevRoom) return null;
          return {
            ...prevRoom,
            numbers: prevRoom.numbers.map((n) =>
              n.id === updatedNumber.id ? updatedNumber : n
            ),
          };
        });
        setUser(user!.id, session.user.token);

        if (user!.creditos < 100) {
          setShowCreditModal(true);
        }
      });

      socket.on("roomComplete", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        setIsDrawStartingModalOpen(true);

        // Opcional: Puedes cerrar el modal después de 30 segundos
        setTimeout(() => {
          setIsDrawStartingModalOpen(false);
        }, 30000);
      });

      socket.on("winnerSelected", (winnerData) => {
        setWinnerModalState({
          isOpen: true,
          winner: {
            id: winnerData.user.id,
            name: winnerData.user.name,
            apellido: winnerData.user.apellido_paterno,
            image: winnerData.user.profilePicture,
            winningNumber: winnerData.winner.valor,
          },
        });
      });

      socket.on("newRoomAvailable", () => {
        fetchRoomData(session.user.token); // Fetch new room when available
      });

      socket.on("error", (msg) => {
        handleAssignNumberError(msg);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [session, status, room?.id]);

  const fetchRoomData = async (token: string) => {
    try {
      const { data } = await lotussApi.get("/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoom(data[0]);
    } catch (error) {
      setErrorModalState({
        isOpen: true,
        message: "Error fetching room data. Please try again later.",
      });
    }
  };

  const assignNumber = (numberId: number, roomId: number) => {
    if (!session || !user || user.creditos < 100) {
      return setShowCreditModal(true);
    }

    socket.emit("assignNumber", {
      idNumber: numberId,
      idUser: user.id,
      idRoom: roomId,
    });
  };

  const handleAssignNumberError = (error: any) => {
    setErrorModalState({
      isOpen: true,
      message: "Ocurrió un error al intentar asignar el número.",
    });
  };

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

  useEffect(() => {
    if (room && room.status === "COMPLETA" && room.drawStartTime) {
      const currentTime = new Date().getTime(); // Obtiene el tiempo actual en milisegundos
      const startTime = new Date(room.drawStartTime).getTime(); // Convierte a milisegundos

      const timeElapsed = Math.floor((currentTime - startTime) / 1000); // Tiempo transcurrido en segundos

      // 30 segundos menos el tiempo que ya ha pasado
      const timeLeft = 30 - timeElapsed;

      if (timeLeft > 0) {
        setIsDrawStartingModalOpen(true);
        setTimeout(() => {
          setIsDrawStartingModalOpen(false);
        }, timeLeft * 1000); // Ajusta el tiempo restante
      }
    }
  }, [room]);

  return {
    room,
    showCreditModal,
    setShowCreditModal,
    errorModalState,
    setErrorModalState,
    winnerModalState,
    setWinnerModalState,
    isDrawStartingModalOpen,
    setIsDrawStartingModalOpen,
    assignNumber,
  };
};
