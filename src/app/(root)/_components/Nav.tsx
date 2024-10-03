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
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer">
                      Inicio
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/game" className="cursor-pointer">
                      Jugar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer">
                      Ver Perfil
                    </Link>
                  </DropdownMenuItem>
                  {session && session.user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        Ir al Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
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
                  <Link
                    href="/"
                    className="block py-2 px-4 text-sm hover:bg-gray-100 rounded-md"
                    onClick={closeSheet}
                  >
                    Inicio
                  </Link>
                  <Link
                    href="/game"
                    className="block py-2 px-4 text-sm hover:bg-gray-100 rounded-md"
                    onClick={closeSheet}
                  >
                    Jugar
                  </Link>
                  <Link
                    href="/perfil"
                    className="block py-2 px-4 text-sm hover:bg-gray-100 rounded-md"
                    onClick={closeSheet}
                  >
                    Ver Perfil
                  </Link>
                  {session && session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="block py-2 px-4 text-sm hover:bg-gray-100 rounded-md"
                      onClick={closeSheet}
                    >
                      Dashboard
                    </Link>
                  )}
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
