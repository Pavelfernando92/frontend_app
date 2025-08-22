"use client";

import { CoinsIcon, LogOut, Menu, Home, Gamepad2, User, BarChart3, Users } from "lucide-react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useUsersStore from "@/store/users.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRoleEnum } from "@/enums/user.enums";
import { navigationLinks } from "../_data/nav";
import { usePathname } from "next/navigation";

const Nav = () => {
  const { data: session } = useSession();
  const { user } = useUsersStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  // Función para obtener el icono correspondiente a cada enlace
  const getIconForPath = (path: string) => {
    switch (path) {
      case "/":
        return <Home className="h-4 w-4" />;
      case "/game":
        return <Gamepad2 className="h-4 w-4" />;
      case "/perfil":
        return <User className="h-4 w-4" />;
      case "/admin":
        return <BarChart3 className="h-4 w-4" />;
      case "/embajadores":
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Función para verificar si un enlace está activo
  const isActiveLink = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-[#800020] shadow-lg border-b-2 border-[#FFD700]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" passHref className="flex-shrink-0">
            <Image
              src={LogoLottus}
              alt="LOTUSS Logo"
              width={140}
              height={45}
              className="cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationLinks.map((link) => {
              if (link.roles.includes(session?.user.role as UserRoleEnum)) {
                const isActive = isActiveLink(link.path);
                return (
                  <Link key={link.path} href={link.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`h-12 px-6 text-white font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-[#FFD700] text-[#800020] shadow-lg hover:bg-[#FFD700]/90"
                          : "hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
                      }`}
                    >
                      {getIconForPath(link.path)}
                      <span className="ml-2">{link.name}</span>
                    </Button>
                  </Link>
                );
              }
              return null;
            })}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {user && (
              <>
                {/* Credits Display */}
                <div className="flex items-center bg-[#FFD700]/10 text-white px-4 py-2 rounded-full border border-[#FFD700]/30">
                  <CoinsIcon className="h-5 w-5 text-[#FFD700] mr-2" />
                  <span className="font-semibold text-lg">{user.creditos}</span>
                  <span className="text-sm text-[#FFD700]/80 ml-1">créditos</span>
                </div>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto">
                      <div className="flex items-center space-x-3 p-2 rounded-full hover:bg-[#FFD700]/10 transition-colors">
                        <Avatar className="w-12 h-12 border-2 border-[#FFD700]/50">
                          <AvatarImage
                            src={user.profilePicture}
                            alt="Foto de perfil"
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-[#FFD700] text-[#800020] font-bold">
                            {user.nombre?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-white font-medium text-sm">{user.nombre || "Usuario"}</p>
                          <p className="text-[#FFD700]/80 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2">
                    <div className="px-2 py-1">
                      <p className="text-sm font-medium text-gray-900">Mi Cuenta</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/perfil" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Ver Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-3">
            {user && (
              <>
                {/* Mobile Credits Display */}
                <div className="flex items-center bg-[#FFD700]/10 text-white px-3 py-2 rounded-full border border-[#FFD700]/30">
                  <CoinsIcon className="h-4 w-4 text-[#FFD700] mr-1" />
                  <span className="font-semibold text-sm">{user.creditos}</span>
                </div>

                {/* Mobile User Avatar */}
                <Avatar className="w-10 h-10 border-2 border-[#FFD700]/50">
                  <AvatarImage src={user.profilePicture} alt="Foto de perfil" />
                                            <AvatarFallback className="bg-[#FFD700] text-[#800020] font-bold">
                            {user.nombre?.charAt(0) || "U"}
                          </AvatarFallback>
                </Avatar>
              </>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#FFD700]/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-[#800020] border-l-2 border-[#FFD700]/20">
                <div className="flex flex-col h-full">
                  {/* User Info Header */}
                  {user && (
                    <div className="p-4 border-b border-[#FFD700]/20">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-16 h-16 border-2 border-[#FFD700]/50">
                          <AvatarImage src={user.profilePicture} alt="Foto de perfil" />
                          <AvatarFallback className="bg-[#FFD700] text-[#800020] font-bold text-lg">
                            {user.nombre?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-semibold text-lg">{user.nombre || "Usuario"}</p>
                          <p className="text-[#FFD700]/80 text-sm">{user.email}</p>
                          <div className="flex items-center mt-1">
                            <CoinsIcon className="h-4 w-4 text-[#FFD700] mr-1" />
                            <span className="text-white font-bold">{user.creditos} créditos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav className="flex-1 p-4 space-y-2">
                    {navigationLinks.map((link) => {
                      if (link.roles.includes(session?.user.role as UserRoleEnum)) {
                        const isActive = isActiveLink(link.path);
                        return (
                          <Link
                            key={link.path}
                            href={link.path}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-[#FFD700] text-[#800020] shadow-lg"
                                : "text-white hover:bg-[#FFD700]/10"
                            }`}
                            onClick={closeSheet}
                          >
                            {getIconForPath(link.path)}
                            <span className="font-medium">{link.name}</span>
                          </Link>
                        );
                      }
                      return null;
                    })}
                  </nav>

                  {/* Logout Button */}
                  <div className="p-4 border-t border-[#FFD700]/20">
                    <Button
                      variant="destructive"
                      className="w-full justify-center h-12"
                      onClick={() => {
                        handleSignOut();
                        closeSheet();
                      }}
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Cerrar sesión
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
