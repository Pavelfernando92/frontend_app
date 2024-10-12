import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useUsersStore from "@/store/users.store";
import { Menu } from "lucide-react";
import { Session } from "next-auth";
import React from "react";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  session: Session | null;
};

const Navbar = (props: Props) => {
  const { sidebarOpen, setSidebarOpen, session } = props;
  const { user } = useUsersStore();

  if (!session) {
    return null;
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
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                className="object-cover"
                src={user?.profilePicture}
                alt="Foto de perfil"
              />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
            <span className="font-bold">{session.user.nombre}</span>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
