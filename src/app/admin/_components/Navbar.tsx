import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, ChevronDown, Menu } from "lucide-react";
import React from "react";

type Props = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const Navbar = (props: Props) => {
  const { sidebarOpen, setSidebarOpen } = props;
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
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="ml-2">
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="User"
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>John Doe</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
