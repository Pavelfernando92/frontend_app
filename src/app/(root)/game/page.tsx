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
        <div ref={gridRef}>
          <NumberGrid room={room} user={user!} assignNumber={assignNumber} minimumCredits={config?.minimumCredits || 100} />
        </div>
      </div>
    </div>
  );
}
