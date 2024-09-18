import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import React from "react";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  session: any;
};

const Navbar = (props: Props) => {
  const { sidebarOpen, setSidebarOpen, session } = props;
  if (!session) {
    return;
  }
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn("md:hidden", sidebarOpen ? "hidden" : "")}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center">
            <img
              src="https://placehold.co/400"
              alt="User"
              className="w-8 h-8 rounded-full mr-2"
            />
            <span>{session.user.nombre}</span>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
