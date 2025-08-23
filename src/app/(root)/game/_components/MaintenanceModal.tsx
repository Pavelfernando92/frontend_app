"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Wrench } from "lucide-react";

export default function MaintenanceModal() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <Dialog open={true} onOpenChange={handleGoHome}>
      <DialogContent 
        className="sm:max-w-md bg-gradient-to-br from-[#800020] to-[#4a0012] text-white border-[#FFD700] border-2"
        onEscapeKeyDown={handleGoHome}
        onPointerDownOutside={handleGoHome}
        onInteractOutside={handleGoHome}
      >
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#FFD700] rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-[#FFD700] p-4 rounded-full">
                <Wrench className="h-12 w-12 text-[#800020] animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-[#FFD700] flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Mantenimiento en Progreso
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6 py-4">
          <div className="space-y-3">
            <p className="text-lg font-medium">
              🚧 Estamos mejorando tu experiencia de juego 🚧
            </p>
            <p className="text-sm text-gray-200 leading-relaxed">
              Nuestro equipo está trabajando para brindarte una mejor experiencia. 
              El juego estará disponible nuevamente muy pronto.
            </p>
          </div>
          
          <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-4">
            <p className="text-sm text-[#FFD700] font-medium">
              💡 Mientras tanto, puedes revisar las promociones disponibles
            </p>
          </div>
          
          <Button 
            onClick={handleGoHome}
            className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#800020] font-bold py-3 text-lg transition-all duration-200 hover:scale-105"
          >
            Ir a Página Principal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
