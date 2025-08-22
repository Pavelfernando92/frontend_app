"use client";

import { useEffect } from "react";
import Nav from "./_components/Nav";
import Footer from "./_components/footer";
import { signOut, useSession } from "next-auth/react";
import useUsersStore from "@/store/users.store";

type Props = {
  children: React.ReactNode;
};

const LayoutRoot = ({ children }: Props) => {
  const { data: session, status } = useSession();
  const { user, setUser, error } = useUsersStore();

  // Efecto para actualizar la información del usuario cuando se autentica
  useEffect(() => {
    const updateUser = async () => {
      if (session && status === "authenticated" && !user) {
        try {
          await setUser(session.user.id, session.user.token);
        } catch (error) {
          console.error("Error al obtener información del usuario:", error);
          // Si hay error al obtener el usuario, cerrar sesión
          signOut({ callbackUrl: "/" });
        }
      }
    };

    updateUser();
  }, [session, status, user, setUser]);

  // Efecto para manejar la autenticación y errores
  useEffect(() => {
    // Si está cargando, no hacer nada
    if (status === "loading") {
      return;
    }

    // Si no hay sesión o no está autenticado, cerrar sesión
    if (status === "unauthenticated" || !session) {
      signOut({ callbackUrl: "/" });
      return;
    }

    // Si hay error en el store de usuarios, cerrar sesión
    if (error) {
      console.error("Error en el store de usuarios:", error);
      signOut({ callbackUrl: "/" });
      return;
    }

    // Si está autenticado pero no hay usuario después de un tiempo, cerrar sesión
    if (status === "authenticated" && session && !user) {
      const timeoutId = setTimeout(() => {
        if (!user) {
          console.warn("Usuario no encontrado después de la autenticación");
          signOut({ callbackUrl: "/" });
        }
      }, 5000); // 5 segundos de espera

      return () => clearTimeout(timeoutId);
    }
  }, [session, status, error, user]);

  // Mostrar loading mientras se verifica la autenticación
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#800020] to-[#FF0000] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFD700] mx-auto mb-4"></div>
        </div>
      </main>
    );
  }

  // Si no está autenticado, no mostrar contenido
  if (status === "unauthenticated" || !session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#800020] to-[#FF0000] text-white">
      <Nav />
      {children}
      <Footer />
    </main>
  );
};

export default LayoutRoot;
