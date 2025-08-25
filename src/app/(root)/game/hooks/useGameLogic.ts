// hooks/useGameLogic.ts
import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import lotussApi from "@/lib/axios";
import useUsersStore from "@/store/users.store";
import { RoomsInterface } from "../../interfaces/rooms.interface";
import { WinnerInterface } from "../../interfaces/winner.interface";
import { ConfigutarionInterface } from "../../interfaces/config.interface";

// Singleton socket instance
let globalSocket: Socket | null = null;
let isConnecting = false;
let hasInitialized = false;

export const useGameLogic = () => {
  const { data: session, status } = useSession();
  const { user, setUser } = useUsersStore();
  const [room, setRoom] = useState<RoomsInterface | null>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);
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
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  // Función para actualizar el usuario
  const updateUser = useCallback(async () => {
    if (!session?.user?.token || !user?.id) return;
    
    try {
      setIsUpdatingUser(true);
      await setUser(user.id, session.user.token);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsUpdatingUser(false);
    }
  }, [session?.user?.token, user?.id, setUser]);

  const fetchConfigData = useCallback(async (token: string) => {
    try {
      const { data } = await lotussApi("/config", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfig({
        minimumCredits: data.minimumCredits,
        prizeAmount: data.prizeAmount,
        totalOfNumbers: data.totalOfNumbers,
      });
      if (data.isMaintenance) {
        setIsMaintenance(true);
      }
    } catch (error) {
      console.log(`Error al obtener la configuración`);
      setErrorModalState({
        isOpen: true,
        message: "Error al obtener la configuración.",
      });
    }
  }, []);

  const fetchRoomData = useCallback(async (token: string) => {
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
  }, []);

  const handleAssignNumberError = useCallback((msg: unknown) => {
    setErrorModalState({
      isOpen: true,
      message: "Ocurrió un error al intentar asignar el número.",
    });
  }, []);

  // Actualizar usuario cuando se autentica y cuando entra a la página
  // Esto asegura que los créditos estén siempre actualizados al entrar al juego
  useEffect(() => {
    if (session && status === "authenticated" && user?.id) {
      updateUser();
    }
  }, [session, status, user?.id, updateUser]);

  // Initialize WebSocket connection only once when authenticated
  useEffect(() => {
    if (session && status === "authenticated" && !hasInitialized) {
      hasInitialized = true;
      
      // Get the socket URL and ensure it uses the correct protocol
      const socketUrl = process.env.NEXT_PUBLIC_BACKEND_SOCKET;
      if (!socketUrl) {
        console.error("NEXT_PUBLIC_BACKEND_SOCKET environment variable is not set");
        setErrorModalState({
          isOpen: true,
          message: "WebSocket configuration error. Please contact support.",
        });
        return;
      }

      // Convert http:// to ws:// or https:// to wss://
      const wsUrl = socketUrl.replace(/^http/, 'ws');
      
      console.log("Connecting to WebSocket:", wsUrl);
      console.log("Session token:", session.user.token ? "Present" : "Missing");
      
      // Only create socket if it doesn't exist and we're not already connecting
      if (!globalSocket && !isConnecting) {
        isConnecting = true;
        
        globalSocket = io(wsUrl, {
          transports: ['websocket', 'polling'],
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          forceNew: false,
        });

        const socket = globalSocket;

        // Test basic connection
        socket.on("connect", () => {
          console.log("WebSocket connected successfully with ID:", socket.id);
          setIsSocketConnected(true);
          isConnecting = false;
        });

        socket.on("connect_error", (error) => {
          console.error("WebSocket connection error:", error);
          setIsSocketConnected(false);
          isConnecting = false;
          setErrorModalState({
            isOpen: true,
            message: `Failed to connect to game server: ${error.message || 'Unknown error'}`,
          });
        });

        socket.on("disconnect", (reason) => {
          console.log("WebSocket disconnected:", reason);
          setIsSocketConnected(false);
          isConnecting = false;
          
          if (reason === "io server disconnect") {
            console.log("Server disconnected, attempting to reconnect...");
            socket.connect();
          }
        });

        socket.on("error", (error) => {
          console.error("Socket error:", error);
          setErrorModalState({
            isOpen: true,
            message: `Socket error: ${error.message || 'Unknown error'}`,
          });
        });

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
          
          // Actualizar usuario después de asignar un número para reflejar créditos gastados
          // Esto asegura que los créditos se actualicen inmediatamente después de jugar
          if (user) {
            // Pequeño delay para asegurar que el servidor haya procesado la transacción
            setTimeout(() => {
              updateUser();
            }, 500);
            
            if (user.creditos < (config?.minimumCredits || 100)) {
              setShowCreditModal(true);
            }
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
          if (user) {
            // Actualizar usuario después de que se seleccione un ganador
            updateUser();
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
          }
        });

        socket.on("newRoomAvailable", () => {
          fetchRoomData(session.user.token);
        });

        socket.on("error", (msg) => {
          handleAssignNumberError(msg);
        });
      } else if (globalSocket) {
        // If socket already exists, just update the connection state
        setIsSocketConnected(globalSocket.connected);
      }
    }
  }, [session, status, fetchRoomData, handleAssignNumberError, user, config?.minimumCredits, updateUser]);

  // Fetch room data when authenticated
  useEffect(() => {
    if (session && status === "authenticated") {
      fetchRoomData(session.user.token);
    }
  }, [session, status, fetchRoomData]);

  // Join room when room data is available and socket is connected
  useEffect(() => {
    if (isSocketConnected && room?.id && globalSocket) {
      console.log("Joining room:", room.id);
      globalSocket.emit("joinRoom", room.id);
    }
  }, [isSocketConnected, room?.id]);

  useEffect(() => {
    if (!session) {
      return;
    }
    fetchConfigData(session.user.token);
  }, [session, fetchConfigData]);

  const assignNumber = useCallback(async (numberId: number, roomId: number) => {
    // Prevenir asignación si se está actualizando el usuario
    // Esto evita inconsistencias cuando el usuario presiona rápidamente varios números
    if (isUpdatingUser) {
      console.log("No se puede asignar número mientras se actualiza el usuario");
      return;
    }

    if (!session || !user || user.creditos < (config?.minimumCredits || 100)) {
      return setShowCreditModal(true);
    }

    if (!globalSocket || !isSocketConnected) {
      setErrorModalState({
        isOpen: true,
        message: "Not connected to game server. Please refresh the page and try again.",
      });
      return;
    }

    globalSocket.emit("assignNumber", {
      idNumber: numberId,
      idUser: user.id,
      idRoom: roomId,
    });
  }, [session, user, config?.minimumCredits, isSocketConnected, isUpdatingUser]);

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
    isSocketConnected,
    isMaintenance,
    isUpdatingUser,
    updateUser,
  };
};
