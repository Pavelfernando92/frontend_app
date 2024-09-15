"use client";
import { LogOut, Menu, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import LogoLottus from "../../../../public/images/LotusLogo.png";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Nav = () => {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-full mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" passHref>
              <Image
                src={LogoLottus}
                alt="LOTUSS Logo"
                width={130}
                height={40}
                className="cursor-pointer"
              />
            </Link>

            {/* Navigation Links
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-[#800020] font-medium text-xl"
              >
                Inicio
              </Link>
              <Link
                href="/juegos"
                className="text-gray-700 hover:text-[#800020] font-medium text-xl"
              >
                Juegos
              </Link>
            </div> */}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full">
                  <UserCircle className="h-8 w-8 text-[#800020]" />
                  <span className="sr-only">Abrir perfil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer">
                    Editar Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  {session && session.user.role === "ADMIN" && (
                    <Link href="/admin" className="cursor-pointer">
                      Ir al Dashboard
                    </Link>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Button
                    variant="destructive"
                    className="w-full justify-start mb-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <Sheet>
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
                  >
                    Inicio
                  </Link>
                  <Link
                    href="/juegos"
                    className="block py-2 px-4 text-sm hover:bg-gray-100 rounded-md"
                  >
                    Juegos
                  </Link>
                  <Link
                    href="/perfil"
                    className="block py-2 px-4 text-sm hover:bg-gray-100 rounded-md"
                  >
                    Editar Perfil
                  </Link>
                  {session && session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="block py-2 px-4 text-sm hover:bg-gray-100 rounded-md"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Button
                    variant="destructive"
                    className="w-full justify-start mb-2"
                    onClick={handleSignOut}
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
