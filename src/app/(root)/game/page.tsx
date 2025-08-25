"use client";

import { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { NoRoomsAvailable } from "./_components/NoRoomsAvailable";
import CreditWarningModal from "./_components/CreditWarningModal";
import RoomCard from "./_components/RoomCard";
import { ColorLegend } from "./_components/ColorLegend";
import NumberGrid from "./_components/NumberGrid";
import { ErrorModal } from "./_components/ErrorModal";
import WinnerModal from "./_components/WinnerModal";
import DrawStartingModal from "./_components/DrawStartingModal";
import MaintenanceModal from "./_components/MaintenanceModal";
import { useGameLogic } from "./hooks/useGameLogic";
import { PrizeDisplay } from "./_components/PrizeDisplay";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function GamePage() {
  const {
    session,
    user,
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
    config,
    isMaintenance,
    isUpdatingUser,
  } = useGameLogic();

  const gridRef = useRef<HTMLDivElement | null>(null); // Ref to the number grid

  useEffect(() => {
    if (!session?.user) {
      redirect("/");
    }
  }, [session]);

  useEffect(() => {
    if (user && config && user.creditos < (config?.minimumCredits || 100) && !isMaintenance) {      
      setShowCreditModal(true);
    }
  }, [user, config, setShowCreditModal, isMaintenance]);

  const handleParticipateClick = () => {
    gridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isMaintenance) {
    return <MaintenanceModal />;
  }

  if (!room) {
    return <NoRoomsAvailable />;
  }

  const availableNumbers = room?.numbers.filter((n) => !n.userId).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#800020] to-[#FF0000] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Indicador de carga cuando se actualiza el usuario */}
        {isUpdatingUser && (
          <div className="fixed top-4 right-4 z-50 bg-black/80 rounded-lg p-3 flex items-center gap-2">
            <LoadingSpinner size={16} />
            <span className="text-sm text-white">Actualizando créditos...</span>
          </div>
        )}

        <CreditWarningModal
          showModal={showCreditModal}
          setShowModal={setShowCreditModal}
          totalNeeded={config?.minimumCredits || 0}
        />
        <ErrorModal
          isOpen={errorModalState.isOpen}
          message={errorModalState.message}
          onClose={() => setErrorModalState({ isOpen: false, message: "" })}
        />
        <WinnerModal
          winner={winnerModalState.winner}
          isOpen={winnerModalState.isOpen}
          onClose={() => setWinnerModalState({ isOpen: false, winner: null })}
        />
        <DrawStartingModal
          isOpen={isDrawStartingModalOpen}
          onClose={() => setIsDrawStartingModalOpen(false)}
          timeRemaining={timeRemaining}
        />

        {/* Prize Display */}
        <PrizeDisplay
          prizeAmount={config?.prizeAmount || 0}
          onParticipateClick={handleParticipateClick}
        />

        {/* Room Card */}
        <RoomCard
          room={room}
          availableNumbers={availableNumbers}
          totalOfNumbers={config?.totalOfNumbers || 0}
        />

        <ColorLegend />

        {/* Number Grid */}
        <div ref={gridRef} className="relative">
          <NumberGrid 
            room={room} 
            user={user!} 
            assignNumber={assignNumber} 
            minimumCredits={config?.minimumCredits || 100} 
            isUpdatingUser={isUpdatingUser}
          />
          
          {/* Overlay para deshabilitar interacción durante actualización */}
          {isUpdatingUser && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div className="bg-black/80 rounded-lg p-4 flex items-center gap-3">
                <LoadingSpinner size={20} />
                <span className="text-white font-medium">Actualizando créditos...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
