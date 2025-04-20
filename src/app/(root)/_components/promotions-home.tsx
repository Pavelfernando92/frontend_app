"use client";

import type { PromocionInterface } from "@/app/admin/promociones/interface/promocion.interface";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Gift,
  Sparkles,
  Timer,
  Zap,
  PartyPopper,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  cargandoPromociones: boolean;
  promociones: PromocionInterface[];
};

const PromotionsCards = ({ cargandoPromociones, promociones }: Props) => {
  // Verificar si una promoción está activa
  const esPromocionActiva = (validUntil: string) => {
    return new Date(validUntil) > new Date();
  };

  // Calcular días restantes
  const calcularDiasRestantes = (validUntil: string) => {
    const hoy = new Date();
    const fechaFin = new Date(validUntil);
    const diferencia = fechaFin.getTime() - hoy.getTime();
    return Math.max(0, Math.ceil(diferencia / (1000 * 3600 * 24)));
  };

  // State to track which card is being hovered
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Animated decorative elements
  const DecorativeElements = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#FFD700]"
          initial={{
            x: Math.random() * 100 - 50 + "%",
            y: Math.random() * 100 - 50 + "%",
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: [Math.random() * 100 - 50 + "%", Math.random() * 100 - 50 + "%"],
            y: [Math.random() * 100 - 50 + "%", Math.random() * 100 - 50 + "%"],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3 + Math.random() * 5,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Sección de Promociones */}
      <motion.div
        className="mt-16 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h3 className="text-3xl font-bold text-[#FFD700] flex items-center relative">
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
              <Gift className="h-8 w-8" />
            </motion.div>
            <span className="relative">
              Promociones Especiales
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#FFD700] to-transparent"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
            <motion.div
              className="absolute -top-6 -right-12 text-2xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Sparkles className="h-6 w-6 text-[#FFD700]" />
            </motion.div>
          </h3>
        </motion.div>

        {cargandoPromociones ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-[#FFFFFF]/5 backdrop-blur-lg overflow-hidden border-[#FFD700]/20 h-full">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 bg-[#FFFFFF]/10" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full bg-[#FFFFFF]/10" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full bg-[#FFFFFF]/10" />
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : promociones.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-[#800020]/20 backdrop-blur-lg border-[#FFD700] p-8 text-center relative overflow-hidden">
              <DecorativeElements />
              <CardContent className="pt-6 relative z-10">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Gift className="h-16 w-16 mx-auto mb-4 text-[#FFD700] opacity-70" />
                </motion.div>
                <motion.p
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  No hay promociones disponibles en este momento.
                </motion.p>
                <motion.p
                  className="text-lg text-white/70"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  ¡Vuelve pronto para descubrir ofertas exclusivas!
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {promociones.slice(0, 3).map((promocion, index) => {
                const esActiva = esPromocionActiva(promocion.validUntil);
                const diasRestantes = calcularDiasRestantes(
                  promocion.validUntil
                );
                const isHovered = hoveredCard === String(promocion.id);

                return (
                  <motion.div
                    key={promocion.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.2 },
                    }}
                    className="h-full perspective-1000"
                    onHoverStart={() => setHoveredCard(String(promocion.id))}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    <Card
                      className={`h-full overflow-hidden border-2 relative ${
                        esActiva
                          ? "border-[#FFD700] bg-[#800020]/40"
                          : "border-gray-500/30 bg-[#FFFFFF]/5"
                      } backdrop-blur-lg transition-all duration-300 transform-gpu`}
                      style={{
                        boxShadow: esActiva
                          ? `0 0 20px 0 rgba(255, 215, 0, ${
                              isHovered ? 0.4 : 0.2
                            })`
                          : "none",
                        transform: isHovered
                          ? "translateZ(20px) rotateX(2deg) rotateY(2deg)"
                          : "translateZ(0) rotateX(0) rotateY(0)",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[1]"></div>
                      {esActiva && (
                        <>
                          <div className="absolute top-0 right-0 z-10">
                            <motion.div
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                            >
                              <Badge className="m-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#800020] font-bold hover:from-white hover:to-white flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                ¡ACTIVA!
                              </Badge>
                            </motion.div>
                          </div>

                          {/* Animated background effect for active promotions */}
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {isHovered && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0"
                              >
                                {[...Array(10)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute rounded-full"
                                    initial={{
                                      x: "50%",
                                      y: "150%",
                                      opacity: 0.7,
                                      scale: 0,
                                      backgroundColor:
                                        i % 2 === 0 ? "#FFD700" : "#FFA500",
                                    }}
                                    animate={{
                                      y: "-50%",
                                      scale: Math.random() * 0.5 + 0.5,
                                      opacity: 0,
                                    }}
                                    transition={{
                                      duration: Math.random() * 2 + 1,
                                      repeat: Number.POSITIVE_INFINITY,
                                      delay: Math.random() * 2,
                                      ease: "easeOut",
                                    }}
                                    style={{
                                      left: `${Math.random() * 100}%`,
                                      width: `${Math.random() * 10 + 5}px`,
                                      height: `${Math.random() * 10 + 5}px`,
                                    }}
                                  />
                                ))}
                              </motion.div>
                            )}
                          </div>
                        </>
                      )}

                      <CardHeader className="relative z-10">
                        <CardTitle
                          className={`text-xl ${
                            esActiva ? "text-[#FFD700]" : "text-gray-300"
                          } flex items-center gap-2 line-clamp-2 min-h-[60px]`}
                        >
                          {esActiva && (
                            <motion.div
                              animate={{
                                rotate: [0, 10, 0, -10, 0],
                                scale: [1, 1.2, 1, 1.2, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 3,
                              }}
                            >
                              <Star className="h-5 w-5 text-[#FFD700] fill-[#FFD700]" />
                            </motion.div>
                          )}
                          {promocion.title}
                        </CardTitle>
                        {esActiva && (
                          <CardDescription className="flex items-center mt-2 text-white">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 1,
                              }}
                              className="mr-1"
                            >
                              <Timer className="h-4 w-4" />
                            </motion.div>
                            <motion.span
                              initial={{ opacity: 0.5 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                duration: 0.8,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                              }}
                            >
                              {diasRestantes === 0
                                ? "¡Último día!"
                                : `${diasRestantes} ${
                                    diasRestantes === 1 ? "día" : "días"
                                  } restantes`}
                            </motion.span>
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardContent className="relative z-10">
                        <motion.p
                          className={`${
                            esActiva ? "text-white" : "text-gray-400"
                          } leading-relaxed min-h-[80px] overflow-y-auto max-h-[120px] text-sm md:text-base`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          {promocion.description}
                        </motion.p>
                      </CardContent>

                      <CardFooter className="flex justify-between items-center border-t border-[#FFFFFF]/10 pt-4 relative z-10">
                        <motion.div
                          className="flex items-center text-sm text-white/90 bg-black/20 px-2 py-1 rounded-md"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <CalendarDays className="h-4 w-4 mr-1" />
                          <span className="whitespace-nowrap">
                            Válida hasta:{" "}
                            {new Date(
                              promocion.validUntil
                            ).toLocaleDateString()}
                          </span>
                        </motion.div>

                        {esActiva && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.4 + index * 0.1,
                              type: "spring",
                              stiffness: 500,
                            }}
                            whileHover={{
                              scale: 1.05,
                              transition: { duration: 0.2 },
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#800020] hover:from-white hover:to-white font-bold flex items-center gap-1 shadow-lg shadow-[#FFD700]/20"
                            >
                              <PartyPopper className="h-4 w-4" />
                              ¡Aprovecha!
                            </Button>
                          </motion.div>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {promociones.length > 0 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="inline-block"
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
            >
              <Card className="bg-gradient-to-r from-[#800020]/40 to-[#FFD700]/20 backdrop-blur-lg border-[#FFD700] p-6 inline-block relative overflow-hidden">
                <DecorativeElements />
                <CardContent className="text-center p-0 relative z-10">
                  <motion.div
                    className="flex justify-center mb-2"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <TrendingUp className="h-6 w-6 text-[#FFD700]" />
                  </motion.div>
                  <motion.p
                    className="text-xl font-bold text-[#FFD700]"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    ¡No te pierdas ninguna oportunidad!
                  </motion.p>
                  <motion.p
                    className="mt-2 text-white"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.4 }}
                  >
                    Mantente atento a nuestras promociones para maximizar tus
                    ganancias.
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default PromotionsCards;
