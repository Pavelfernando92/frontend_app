"use client";
import { UserRoleEnum } from "@/enums/user.enums";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../admin/_components/Navbar";
import { useEffect, useState } from "react";
import { Goal, LayoutDashboard, Users } from "lucide-react";
import Sidebar, { MenuItem } from "../admin/_components/Sidebar";
import useUsersStore from "@/store/users.store";

interface Props {
  children: React.ReactNode;
}
export default function EmbajadoresLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const { user, setUser } = useUsersStore();

  const MAIN_PATH = "/embajadores";

  useEffect(() => {
    const updateUser = async () => {
      if (session && status === "authenticated" && !user) {
        setUser(session.user.id, session.user.token);
      }
    };

    updateUser();
  }, [session, status, user]);

  const CLASSNAME = "mr-2 h-4 w-4";

  const adminMenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className={CLASSNAME} />,
      path: MAIN_PATH,
    },
    {
      label: "Grupo de Usuarios",
      icon: <Users className={CLASSNAME} />,
      path: `${MAIN_PATH}/group`,
    },
    {
      label: "Metas",
      icon: <Goal className={CLASSNAME} />,
      path: `${MAIN_PATH}/goals`,
    },
  ];

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
