"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

import Sidebar from "./_components/Sidebar";
import Navbar from "./_components/Navbar";
import useUsersStore from "@/store/users.store";

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const { setUser, error } = useUsersStore();
  useEffect(() => {
    if (session) {
      const expiresAt = new Date(session.expires).getTime();
      const currentTime = Date.now();

      // If the session is already expired, log out immediately
      if (currentTime >= expiresAt) {
        signOut();
      } else {
        setUser(session.user.id, session.user.token);
      }
    }
  }, [session]);

  useEffect(() => {
    if (error) {
      signOut();
    }
  }, [error]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          session={session}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
