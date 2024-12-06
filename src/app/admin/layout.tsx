"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Sidebar from "./_components/Sidebar";
import Navbar from "./_components/Navbar";
import { UserRoleEnum } from "@/enums/user.enums";
import {
  Bolt,
  BookMarked,
  Component,
  Gamepad,
  LayoutDashboard,
  LogOut,
  Users,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      path: "/admin",
    },
    {
      label: "Usuarios",
      icon: <Users className="mr-2 h-4 w-4" />,
      path: "/admin/usuarios",
    },
    {
      label: "Embajadores",
      icon: <Component className="mr-2 h-4 w-4" />,
      path: "/admin/embajadores",
    },
    {
      label: "Historial de Juegos",
      icon: <BookMarked className="mr-2 h-4 w-4" />,
      path: "/admin/historic-games",
    },
    {
      label: "Juegos en Vivo",
      icon: <Gamepad className="mr-2 h-4 w-4" />,
      path: "/admin/rooms",
    },
    {
      label: "Retiros",
      icon: <Wallet className="mr-2 h-4 w-4" />,
      path: "/admin/retiros",
    },
    {
      label: "Configuración",
      icon: <Bolt className="mr-2 h-4 w-4" />,
      path: "/admin/configuration",
    },
  ];

  useEffect(() => {
    if (session) {
      const expiresAt = new Date(session.expires).getTime();
      const currentTime = Date.now();

      // Si la sesión ha expirado, cerrar sesión inmediatamente
      if (currentTime >= expiresAt) {
        signOut();
      }
    }
  }, [session]);

  if (session && session.user.role === UserRoleEnum.ADMIN) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          menuItems={adminMenuItems}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            session={session}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return router.push("/"); // Si no es Admin
}
