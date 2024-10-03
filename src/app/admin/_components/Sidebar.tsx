import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookMarked,
  Gamepad,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  Wallet,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }: Props) => {
  // Función para cerrar el Sidebar cuando se hace clic en un enlace
  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

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
          <Link href="/admin" onClick={handleLinkClick}>
            <Button variant="ghost" className="w-full justify-start mb-2">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/usuarios" onClick={handleLinkClick}>
            <Button variant="ghost" className="w-full justify-start mb-2">
              <Users className="mr-2 h-4 w-4" />
              Usuarios
            </Button>
          </Link>
          <Link href="/admin/historic-games" onClick={handleLinkClick}>
            <Button variant="ghost" className="w-full justify-start mb-2">
              <BookMarked className="mr-2 h-4 w-4" />
              Historial de Juegos
            </Button>
          </Link>
          <Link href="/admin/rooms" onClick={handleLinkClick}>
            <Button variant="ghost" className="w-full justify-start mb-2">
              <Gamepad className="mr-2 h-4 w-4" />
              Juegos en Vivo
            </Button>
          </Link>
          <Link href="/admin/retiros" onClick={handleLinkClick}>
            <Button variant="ghost" className="w-full justify-start mb-2">
              <Wallet className="mr-2 h-4 w-4" />
              Retiros
            </Button>
          </Link>
          <Separator className="my-4" />
          <Link
            href="/"
            onClick={handleLinkClick}
            className="w-full justify-start"
          >
            <Button variant="default" className="w-full justify-start mb-2">
              Ir a la página principal
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="w-full justify-start mb-2"
            onClick={() => {
              setSidebarOpen(false);
              signOut();
            }}
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
