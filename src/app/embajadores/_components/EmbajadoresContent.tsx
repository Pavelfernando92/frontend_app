"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, CreditCard, TrendingUp, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUsersStore from "@/store/users.store";
import useGroup from "../hooks/useGroup";
import useInviteLink from "@/app/(root)/perfil/hooks/useInviteLink";
import { useSession } from "next-auth/react";
import { useOrigin } from "@/hooks/use-origin";

const EmbajadoresContent: React.FC = () => {
  const { user } = useUsersStore();
  const { data: session } = useSession();
  const origin = useOrigin();

  const {
    getQuantityGroupMembers,
    getGroupGrowth,
    getTotalCreditsGroupPerMonth,
  } = useGroup();
  const [growth, setGrowth] = useState<number | null>(null);
  const [quantityMembers, setQuantityMembers] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number | null>(null);

  const { inviteLink, handleCopyToClipboard, copied } = useInviteLink(
    session,
    origin
  );

  useEffect(() => {
    if (!user) return;
    const getMainInfo = async () => {
      setGrowth(await getGroupGrowth(user.id));
      setQuantityMembers(await getQuantityGroupMembers(user.id));
      setTotalCredits(await getTotalCreditsGroupPerMonth(user.id));
    };
    getMainInfo();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold mb-6 text-[#800020]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Bienvenid@, {user?.nombre}
      </motion.h1>
      <motion.div
        className="bg-white shadow-lg rounded-lg p-6 mb-8 border-l-4 border-[#800020]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg text-gray-700 mb-4">
          Como embajador de nuestra plataforma, ganas créditos por cada miembro
          activo en tu grupo. Cuantos más miembros tengas y más creditos
          ingresen tus usuarios, más créditos recibiras como recompensa.
        </p>
        <p className="text-lg text-gray-700">
          Supervisa tu progreso, el estado de créditos de tu grupo y la cantidad
          de miembros de tu grupo desde esta página.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Créditos Totales
              </CardTitle>
              <CreditCard className="h-4 w-4 text-[#800020]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCredits !== null ? totalCredits : "Cargando..."}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de creditos de tu grupo
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Miembros en tu Grupo
              </CardTitle>
              <Users className="h-4 w-4 text-[#800020]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quantityMembers !== null ? quantityMembers : "Cargando..."}
              </div>
              <p className="text-xs text-muted-foreground">
                Tu total de usuarios
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Crecimiento del Grupo
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#800020]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {growth !== null ? `${growth.toFixed(2)}%` : "Cargando..."}
              </div>
              <p className="text-xs text-muted-foreground">
                Desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        className="bg-gradient-to-br from-[#800020] to-[#4a0012] text-white shadow-lg rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4">Invita a nuevos usuarios</h2>
        <p className="mb-4">
          Comparte este código de invitación para que nuevos usuarios se unan a
          tu grupo:
        </p>
        <div className="flex space-x-4">
          <Input
            value={inviteLink}
            readOnly
            className="bg-white/20 border-white/30 text-white placeholder-white/50 flex-grow"
          />
          <Button
            onClick={handleCopyToClipboard}
            className="bg-white text-[#800020] hover:bg-white/90 transition-colors"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Copiado
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmbajadoresContent;
