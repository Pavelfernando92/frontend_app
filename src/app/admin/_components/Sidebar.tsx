import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Menu, Settings, Users } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }: Props) => {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`bg-white w-64 min-h-screen p-4 ${
          sidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="flex items-center justify-between mb-6">
          <p className="text-2xl font-semibold">
            <span className="text-[#800020]">Lotuss</span> Panel
          </p>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <nav>
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start mb-2">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/usuarios">
            <Button variant="ghost" className="w-full justify-start mb-2">
              <Users className="mr-2 h-4 w-4" />
              Usuarios
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start mb-4">
            <Settings className="mr-2 h-4 w-4" />
            Ajustes
          </Button>
          <Link href="/" className="w-full justify-start">
            <Button variant="default" className="w-full justify-start mb-2">
              Ir a la página principal
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="w-full justify-start mb-2"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
