"use client";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ModalImage from "./_components/modal-image";
import useUsersStore from "@/store/users.store";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Sparkles,
  Star,
  TrendingUp,
  Timer,
  Diamond,
  Flame,
  PartyPopper,
} from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { PromocionInterface } from "../admin/promociones/interface/promocion.interface";
import lotussApi from "@/lib/axios";
import PromotionsCards from "./_components/promotions-home";
import LastWinners from "./_components/last-winners";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { WinnerRoom } from "./interfaces/winner.interface";

const RootPage = () => {
  const { data: session, status } = useSession();
  const { user } = useUsersStore();
  const [promociones, setPromociones] = useState<PromocionInterface[]>([]);
  const [cargandoPromociones, setCargandoPromociones] = useState(true);
  const [winners, setWinners] = useState<WinnerRoom[]>([]);
  const [cargandoWinners, setCargandoWinners] = useState(true);

  useEffect(() => {
    if (status !== "loading" && session) {
      const today = new Date();
      const sessionDate = new Date(session.expires);

      if (today > sessionDate) {
        signOut();
      }
    }
  }, [session, status, user]);

  // Cargar promociones
  useEffect(() => {
    const cargarPromociones = async () => {
      if (session?.user?.token) {
        try {
          setCargandoPromociones(true);
          const res = await lotussApi("promotions", {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          });
          const promocionesActivas = res.data.filter(
            (promocion: PromocionInterface) => promocion.status === true
          );
          setPromociones(promocionesActivas);
        } catch (error) {
          console.error("Error al cargar promociones:", error);
        } finally {
          setCargandoPromociones(false);
        }
      }
    };

    if (session?.user?.token) {
      cargarPromociones();
    }
  }, [session]);

  // Cargar últimos ganadores
  useEffect(() => {
    const getLastWinners = async () => {
      if (!session?.user?.token) {
        return;
      }
      try {
        setCargandoWinners(true);
        const res = await lotussApi("rooms/last-winners", {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        });
        setWinners(res.data);
      } catch (error) {
        console.error("Error al obtener los últimos ganadores:", error);
      } finally {
        setCargandoWinners(false);
      }
    };
    
    getLastWinners();
  }, [session]);

  // Mostrar el modal solo si el usuario no tiene imagen de perfil
  if (session && user && !user.profilePicture) {
    return (
      <div>
        <ModalImage token={session.user.token} userId={user.id} />;
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#800020]/20 via-[#EDE3A2]/10 to-[#800020]/20 border-2 border-[#EDE3A2]/30 shadow-2xl mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#EDE3A2]/20"
                style={{
                  width: Math.random() * 10 + 5,
                  height: Math.random() * 10 + 5,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 lg:p-16">
            <motion.div
              className="space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="space-y-4">
                <motion.div
                  className="flex items-center gap-3 mb-4"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Badge className="bg-[#FFD602] text-[#800020] px-4 py-2 text-sm font-bold hover:text-white">
                    <Flame className="h-4 w-4 mr-1" />
                    ¡SÚPER CALIENTE!
                  </Badge>
                  <Badge className="bg-[#800020] text-white px-4 py-2 text-sm font-bold">
                    <Timer className="h-4 w-4 mr-1" />
                    ¡NO ESPERES MÁS!
                  </Badge>
                </motion.div>

                <motion.h1
                  className="text-5xl lg:text-7xl font-black bg-[#FFD602] bg-clip-text text-transparent leading-tight"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  ¡RASPA Y
                  <br />
                  <span className="text-[#FFD602]">GANA!</span>
                </motion.h1>

                <motion.p
                  className="text-xl lg:text-2xl text-foreground/80 font-medium leading-relaxed text-white"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Únete a la <span className="text-[#FFD602] font-bold">ScratchRoom</span> de Lotuss.
                  <br />
                  Cada raspadita puede cambiar tu vida para siempre.
                </motion.p>
              </div>

              <motion.div
                className="space-y-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/game" className="flex-1">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-[#FFD602] to-[#FFD602] hover:from-[#800020] hover:to-[#800020] text-[#800020] hover:text-[#FFD602]  text-xl font-bold shadow-2xl border-2 border-[#FFD602]/50 relative overflow-hidden group py-6 px-0"
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <Diamond className="h-6 w-6" />
                          JUGAR AHORA
                          <Sparkles className="h-6 w-6" />
                        </span>
                      </Button>
                    </motion.div>
                  </Link>
                </div>

              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-[#FFD602]/30 to-[#800020]/30 rounded-3xl blur-xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />

                <div className="relative bg-card/50 backdrop-blur-lg rounded-2xl p-6 border-2 border-[#FFD602]/30">
                  <Image
                    src="/images/Banner.gif"
                    width={400}
                    height={400}
                    alt="ScratchRoom - Rasca y Gana"
                    className="rounded-xl shadow-2xl w-full"
                    onError={(e) => {
                      e.currentTarget.src = "/luxury-scratch-card-banner.png"
                    }}
                  />

                  <motion.div
                    className="absolute -top-6 -right-6 bg-gradient-to-r from-[#FFD602] to-[#800020] text-white px-6 py-3 rounded-full font-bold text-lg shadow-2xl border-2 border-white/20"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-current" />
                      ¡PREMIO MÁXIMO!
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-4 -left-4 bg-[#800020] text-white px-4 py-2 rounded-full font-bold shadow-xl"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      95% Ganadores
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Banner de Telegram - Únete al Grupo */}
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0088CC] via-[#00A8FF] to-[#0088CC] border-2 border-[#FFD602] shadow-2xl mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: Math.random() * 8 + 4,
                  height: Math.random() * 8 + 4,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 p-8 lg:p-12 text-center">
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <svg 
                  className="w-12 h-12 text-[#0088CC]" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
            </motion.div>

            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              ¡Únete a Nuestro Grupo de Telegram!
            </motion.h2>

            <motion.p
              className="text-lg lg:text-xl text-white/90 mb-8 max-w-3xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              Recibe <span className="text-[#FFD602] font-bold">alertas en tiempo real</span> de nuevas salas, 
              promociones exclusivas y notificaciones de premios. ¡No te pierdas ninguna oportunidad de ganar!
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              <a
                href="https://t.me/+wPPMW9tx0R1mZDI5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-[#0088CC] hover:bg-[#FFD602] hover:text-[#800020] px-8 py-4 rounded-full font-bold text-lg shadow-2xl border-2 border-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                UNIRSE AL GRUPO
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  →
                </motion.div>
              </a>
            </motion.div>

            <motion.div
              className="mt-6 text-white/70 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              <p>✨ Recibe notificaciones instantáneas</p>
              <p>🎯 Acceso a promociones exclusivas</p>
              <p>🏆 Información de salas en tiempo real</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Últimos Ganadores */}
        <LastWinners winners={winners} isLoading={cargandoWinners} />

        {/* Promociones */}
        <PromotionsCards promociones={promociones} cargandoPromociones={cargandoPromociones} />

        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="flex items-center justify-center mb-8"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h3 className="text-3xl font-bold text-[#FFD602] flex items-center relative">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 10, scale: 1.2 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 1.5,
                }}
                className="mr-3"
              >
                <PartyPopper className="h-8 w-8" />
              </motion.div>
              <span className="relative">
                Historias de Éxito
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#FFD602] to-transparent"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                amount: "$1200",
                quote: "No podía creer que había ganado tanto! 🤩 ScratchRoom me encanta!",
              },
              {
                name: "Carlos Rodríguez",
                amount: "$2000",
                quote: "La mejor plataforma de raspaditos. Gané en mi primer intento!!",
              },
              {
                name: "Ana López",
                amount: "$1000",
                quote: "Increíble experiencia. Los premios estan delujo 🤑",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-[#800020] backdrop-blur-lg border-2 border-[#FFD602] rounded-2xl p-6 shadow-xl relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-[#FFD602]/20"
                      style={{
                        width: Math.random() * 8 + 4,
                        height: Math.random() * 8 + 4,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#FFD602] to-[#800020] rounded-full flex items-center justify-center">
                      <Crown className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">{testimonial.name}</h3>
                  <div className="text-2xl font-bold text-[#FFD602] mb-4">{testimonial.amount}</div>
                  <p className="text-white/80 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
};

export default RootPage;
