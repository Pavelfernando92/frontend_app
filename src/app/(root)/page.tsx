"use client";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ModalImage from "./_components/modal-image";
import useUsersStore from "@/store/users.store";
import { Button } from "@/components/ui/button";
import { Sparkles, Ticket, Users } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Banner from "../../../public/images/Banner.gif";

const RootPage = () => {
  const { data: session, status } = useSession();
  const { setUser, user } = useUsersStore();

  const [espaciosDisponibles, setEspaciosDisponibles] = useState(100);
  const [estadoSala, setEstadoSala] = useState("abierta");
  const [numeroActual, setNumeroActual] = useState<number | null>(null);
  const [numerosComprados, setNumerosComprados] = useState<number[]>([]);
  const [numerosCubiertos, setNumerosCubiertos] = useState(new Set());

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

  useEffect(() => {
    if (session && status === "authenticated" && !user) {
      setUser(session.user.id, session.user.token);
    }
  }, [session, status, user]);

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
              className="bg-[#FFD700] text-[#800020] hover:bg-[#FFFFFF] hover:text-[#800020]"
            >
              Jugar Ahora <Sparkles className="ml-2" />
            </Button>
          </Link>
        </div>
        <div className="relative">
          <Image
            src={Banner}
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

      <div className="mt-16 bg-[#FFFFFF]/10 backdrop-blur-lg rounded-lg p-8">
        <h3 className="text-3xl font-bold mb-4 text-[#FFD700]">
          Próximas Promociones
        </h3>
        <p className="text-xl">
          ¡Mantente al tanto de ofertas y bonificaciones emocionantes! Lotus
          actualiza constantemente nuestras promociones para brindarte la mejor
          experiencia de juego en ScratchRoom.
        </p>
      </div>
    </main>
  );
};

export default RootPage;
