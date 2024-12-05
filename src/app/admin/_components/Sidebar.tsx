import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export type MenuItem = {
  label: string;
  icon: React.ReactNode;
  path: string;
};

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  menuItems: MenuItem[];
};

const Sidebar = ({ sidebarOpen, setSidebarOpen, menuItems }: Props) => {
  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
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
        {menuItems.map((item, index) => (
          <Link key={index} href={item.path} onClick={handleLinkClick}>
            <Button variant="ghost" className="w-full justify-start mb-2">
              {item.icon}
              {item.label}
            </Button>
          </Link>
        ))}

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
  );
};

export default Sidebar;
