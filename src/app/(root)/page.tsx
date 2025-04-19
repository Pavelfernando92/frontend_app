"use client";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ModalImage from "./_components/modal-image";
import useUsersStore from "@/store/users.store";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Gift,
  Sparkles,
  Ticket,
  Timer,
  Users,
} from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Banner from "../../../public/images/Banner.gif";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { PromocionInterface } from "../admin/promociones/interface/promocion.interface";
import lotussApi from "@/lib/axios";

const RootPage = () => {
  const { data: session, status } = useSession();
  const { user } = useUsersStore();

  const [espaciosDisponibles] = useState(100);
  const [estadoSala, setEstadoSala] = useState("abierta");
  const [numeroActual, setNumeroActual] = useState<number | null>(null);
  const [numerosComprados, setNumerosComprados] = useState<number[]>([]);
  const [numerosCubiertos, setNumerosCubiertos] = useState(new Set());
  const [promociones, setPromociones] = useState<PromocionInterface[]>([]);
  const [cargandoPromociones, setCargandoPromociones] = useState(true);

  useEffect(() => {
    if (status !== "loading" && session) {
      const today = new Date();
      const sessionDate = new Date(session.expires);

      if (today > sessionDate) {
        signOut();
      }
    }
  }, [session, status, user]);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setEstadoSala("sorteo");
    }, 10000);

    return () => clearTimeout(temporizador);
  }, []);

  useEffect(() => {
    if (estadoSala === "sorteo") {
      const intervaloSorteo = setInterval(() => {
        const nuevoNumero = Math.floor(Math.random() * 100) + 1;
        setNumeroActual(nuevoNumero);
        if (!numerosComprados.includes(nuevoNumero)) {
          setNumerosComprados((prev) => [...prev, nuevoNumero]);
        }
      }, 2000);

      return () => clearInterval(intervaloSorteo);
    }
  }, [estadoSala]);

  useEffect(() => {
    const numerosIniciales = new Set();
    for (let i = 1; i <= 100; i++) {
      if (Math.random() < 0.5) {
        numerosIniciales.add(i);
      }
    }
    setNumerosCubiertos(numerosIniciales);
  }, []);

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

  const alternarCubierto = (numero: number) => {
    setNumerosCubiertos((prev) => {
      const nuevoSet = new Set(prev);
      if (nuevoSet.has(numero)) {
        nuevoSet.delete(numero);
      } else {
        nuevoSet.add(numero);
      }
      return nuevoSet;
    });
  };

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

  // Mostrar el modal solo si el usuario no tiene imagen de perfil
  if (session && user && !user.profilePicture) {
    return (
      <div>
        <ModalImage token={session.user.token} userId={user.id} />;
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="mb-10">
          <h2 className="text-5xl font-extrabold mb-6 text-[#FFD700]">
            Vive la Emoción de ScratchRoom!
          </h2>
          <p className="text-xl mb-8">
            Únete a la exclusiva ScratchRoom de Lotuss y rasca para ganar
            emocionantes premios. ¿Te acompañará la suerte hoy?
          </p>
          <Link href="/game">
            <Button
              size="lg"
              className="bg-[#FFD700] text-[#800020] hover:bg-[#FFFFFF] hover:text-[#800020] text-xl py-8"
            >
              Jugar Ahora <Sparkles className="ml-2" />
            </Button>
          </Link>
        </div>
        <div className="relative">
          <Image
            src={Banner || "/placeholder.svg"}
            width={400}
            height={400}
            alt="Rasca y Gana"
            className="rounded-lg shadow-2xl"
          />
          <div className="absolute -top-4 -left-4 bg-[#FF0000] text-[#FFD700] text-xl font-bold p-3 rounded-full animate-bounce">
            ¡Premio Grande!
          </div>
        </div>
      </div>

      {/* Sección de Promociones */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-[#FFD700] flex items-center">
            <Gift className="mr-3 h-8 w-8" /> Promociones Especiales
          </h3>
        </div>

        {cargandoPromociones ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="bg-[#FFFFFF]/5 backdrop-blur-lg overflow-hidden border-[#FFD700]/20"
              >
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
            ))}
          </div>
        ) : promociones.length === 0 ? (
          <Card className="bg-[#FFD700]/20 backdrop-blur-lg border-[#FFD700] p-8 text-center">
            <CardContent className="pt-6">
              <p className="text-xl">
                No hay promociones disponibles en este momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promociones.slice(0, 3).map((promocion, index) => {
              const esActiva = esPromocionActiva(promocion.validUntil);
              const diasRestantes = calcularDiasRestantes(promocion.validUntil);

              return (
                <motion.div
                  key={promocion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`h-full overflow-hidden border-2 ${
                      esActiva
                        ? "border-[#FFD700] bg-gradient-to-br from-[#800020]/40 to-[#800020]/10"
                        : "border-gray-500/30 bg-[#FFFFFF]/5"
                    } bg-[#FFD700]/20 backdrop-blur-lg border-[#FFD700] hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all duration-300`}
                  >
                    {esActiva && (
                      <div className="absolute top-0 right-0">
                        <Badge className="m-2 bg-[#FFD700] text-[#800020] font-bold hover:bg-white">
                          ¡ACTIVA!
                        </Badge>
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle
                        className={`text-xl ${
                          esActiva ? "text-[#FFD700]" : "text-gray-300"
                        }`}
                      >
                        {promocion.title}
                      </CardTitle>
                      {esActiva && (
                        <CardDescription className="flex items-center mt-2 text-white">
                          <Timer className="h-4 w-4 mr-1" />
                          {diasRestantes === 0
                            ? "¡Último día!"
                            : `${diasRestantes} ${
                                diasRestantes === 1 ? "día" : "días"
                              } restantes`}
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent>
                      <p
                        className={`${
                          esActiva ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {promocion.description}
                      </p>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center border-t border-[#FFFFFF]/10 pt-4">
                      <div className="flex items-center text-sm text-white">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        Válida hasta:{" "}
                        {new Date(promocion.validUntil).toLocaleDateString()}
                      </div>

                      {esActiva && (
                        <Button
                          size="sm"
                          className="bg-[#FFD700] text-[#800020] hover:bg-white font-bold"
                        >
                          ¡Aprovecha!
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {promociones.length > 0 && (
          <div className="mt-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block"
            >
              <Card className="bg-[#FFD700]/20 backdrop-blur-lg border-[#FFD700] p-6 inline-block">
                <CardContent className="text-center p-0">
                  <p className="text-xl font-bold text-[#FFD700]">
                    ¡No te pierdas ninguna oportunidad!
                  </p>
                  <p className="mt-2 text-white">
                    Mantente atento a nuestras promociones para maximizar tus
                    ganancias.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-[#FFFFFF]/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-[#FFD700]">
              <Ticket className="mr-2" /> Lugares Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              {espaciosDisponibles}/100
            </div>
            <Progress
              value={espaciosDisponibles}
              max={100}
              className="h-2 bg-[#FFFFFF]/20"
            />
          </CardContent>
        </Card>

        <Card className="bg-[#FFFFFF]/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-[#FFD700]">
              <Users className="mr-2" /> Estado de la Sala
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={estadoSala === "abierta" ? "default" : "destructive"}
              className="text-lg py-1 px-3"
            >
              {estadoSala === "abierta" ? "Abierta" : "Sorteando"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-[#FFFFFF]/10 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-[#FFD700]">Sorteo Actual</CardTitle>
          </CardHeader>
          <CardContent>
            {estadoSala === "sorteo" ? (
              <div className="text-6xl font-bold text-center animate-pulse">
                {numeroActual}
              </div>
            ) : (
              <div className="text-2xl text-center">
                Esperando a comenzar...
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-4 text-[#FFD700]">
          Números Comprados
        </h3>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 100 }, (_, i) => i + 1).map((numero) => (
            <div
              key={numero}
              className={`aspect-square flex items-center justify-center rounded-md text-lg font-bold cursor-pointer transition-all duration-300 ${
                numerosCubiertos.has(numero)
                  ? "bg-[#800020] text-[#800020]"
                  : numerosComprados.includes(numero)
                  ? "bg-[#FFD700] text-[#800020]"
                  : "bg-[#FFFFFF]/10"
              }`}
              onClick={() => alternarCubierto(numero)}
            >
              {numerosCubiertos.has(numero) ? "" : numero}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default RootPage;
