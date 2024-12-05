"use client";

import { CoinsIcon, LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import LogoLottus from "../../../../public/images/LotusLogoDorado.png";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useUsersStore from "@/store/users.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRoleEnum } from "@/enums/user.enums";
import { navigationLinks } from "../_data/nav";

const Nav = () => {
  const { data: session } = useSession();
  const { user } = useUsersStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <nav className="bg-[#800020] shadow-lg">
      <div className="max-w-full mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" passHref>
            <Image
              src={LogoLottus}
              alt="LOTUSS Logo"
              width={130}
              height={40}
              className="cursor-pointer"
            />
          </Link>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-4">
                    {user.profilePicture && (
                      <Avatar className="w-14 h-14">
                        <AvatarImage
                          src={user.profilePicture}
                          alt="Foto de perfil"
                          className="object-cover"
                        />
                        <AvatarFallback>Perfil</AvatarFallback>
                      </Avatar>
                    )}
                    {/* Display Coins */}
                    <div className="flex items-center text-white space-x-1">
                      <CoinsIcon className="h-5 w-5 text-[#FFD700]" />
                      <span className="font-medium">{user.creditos}</span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {navigationLinks.map((link) => {
                    // Filtra los enlaces por el rol del usuario
                    if (
                      link.roles.includes(session?.user.role as UserRoleEnum)
                    ) {
                      return (
                        <DropdownMenuItem key={link.path} asChild>
                          <Link href={link.path} className="cursor-pointer">
                            {link.name}
                          </Link>
                        </DropdownMenuItem>
                      );
                    }
                    return null;
                  })}
                  <DropdownMenuItem asChild>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            {user && user.profilePicture && (
              <Avatar>
                <AvatarImage src={user.profilePicture} alt="Foto de perfil" />
                <AvatarFallback>Perfil</AvatarFallback>
              </Avatar>
            )}
            <div className="flex items-center text-white space-x-1">
              <CoinsIcon className="h-5 w-5" />
              <span className="font-medium">{user?.creditos}</span>
            </div>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col space-y-4">
                  {navigationLinks.map((link) => {
                    // Filtrar enlaces por el rol del usuario
                    if (
                      link.roles.includes(session?.user.role as UserRoleEnum)
                    ) {
                      return (
                        <Link
                          key={link.path}
                          href={link.path}
                          className="block py-2 px-4 text-sm hover:bg-gray-100 rounded-md"
                          onClick={closeSheet}
                        >
                          {link.name}
                        </Link>
                      );
                    }
                    return null;
                  })}
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={() => {
                      handleSignOut();
                      closeSheet();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
