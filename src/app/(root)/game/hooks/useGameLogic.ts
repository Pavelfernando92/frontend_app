// hooks/useGameLogic.ts
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import lotussApi from "@/lib/axios";
import useUsersStore from "@/store/users.store";
import { RoomsInterface } from "../../interfaces/rooms.interface";
import { WinnerInterface } from "../../interfaces/winner.interface";
import { ConfigutarionInterface } from "../../interfaces/config.interface";

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
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [config, setConfig] = useState<ConfigutarionInterface>();

  useEffect(() => {
    if (session && status === "authenticated") {
      fetchRoomData(session.user.token);

      socket = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET!);

      socket.on("roomData", (roomData: RoomsInterface) => {
        setRoom(roomData);

        if (roomData.status === "COMPLETA" && roomData.drawStartTime) {
          const currentTime = new Date();
          const drawStartTime = new Date(roomData.drawStartTime);
          const timeRemaining = drawStartTime.getTime() - currentTime.getTime();

          if (timeRemaining > 0) {
            setTimeRemaining(Math.floor(timeRemaining / 1000));
            setIsDrawStartingModalOpen(true);
          }
        }
      });

      socket.emit("joinRoom", room?.id);

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

      socket.on("roomComplete", (roomComplete) => {
        const currentTime = new Date();
        const drawStartTime = new Date(roomComplete.drawStartTime);
        const timeRemaining = drawStartTime.getTime() - currentTime.getTime();

        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsDrawStartingModalOpen(true);
        setTimeRemaining(Math.floor(timeRemaining / 1000));
      });

      socket.on("timeRemaining", (remainingTime: number) => {
        setTimeRemaining(Math.floor(remainingTime / 1000));
        setIsDrawStartingModalOpen(true);
      });

      socket.on("winnerSelected", (winnerData) => {
        setWinnerModalState({
          isOpen: true,
          winner: {
            id: winnerData.user.id,
            name: winnerData.user.nombre,
            apellido: winnerData.user.apellido_paterno,
            image: winnerData.user.profilePicture,
            winningNumber: winnerData.winner.valor,
          },
        });
      });

      socket.on("newRoomAvailable", () => {
        fetchRoomData(session.user.token);
      });

      socket.on("error", (msg) => {
        handleAssignNumberError(msg);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [session, status, room?.id]);

  useEffect(() => {
    if (!session) {
      return;
    }
    fetchConfigData(session.user.token);
  }, [session]);

  const fetchConfigData = async (token: string) => {
    try {
      const { data } = await lotussApi("/config", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfig({
        minimumCredits: data.minimumCredits,
        prizeAmount: data.prizeAmount,
        totalOfNumbers: data.totalOfNumbers,
      });
    } catch (error) {
      console.log(`Error al obtener la configuración`);
      setErrorModalState({
        isOpen: true,
        message: "Error al obtener la configuración.",
      });
    }
  };

  const fetchRoomData = async (token: string) => {
    try {
      const { data } = await lotussApi.get("/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoom(data[0]);
    } catch (error) {
      console.error("Error fetching room:", error);
      setErrorModalState({
        isOpen: true,
        message: "Error fetching room data. Please try again later.",
      });
    }
  };

  const assignNumber = async (numberId: number, roomId: number) => {
    if (!session || !user || user.creditos < 100) {
      return setShowCreditModal(true);
    }

    socket.emit("assignNumber", {
      idNumber: numberId,
      idUser: user.id,
      idRoom: roomId,
    });
  };

  const handleAssignNumberError = (msg: unknown) => {
    setErrorModalState({
      isOpen: true,
      message: "Ocurrió un error al intentar asignar el número.",
    });
  };

  return {
    session,
    user,
    status,
    room,
    showCreditModal,
    setShowCreditModal,
    errorModalState,
    setErrorModalState,
    winnerModalState,
    setWinnerModalState,
    isDrawStartingModalOpen,
    setIsDrawStartingModalOpen,
    timeRemaining,
    assignNumber,
    fetchRoomData,
    config,
  };
};
