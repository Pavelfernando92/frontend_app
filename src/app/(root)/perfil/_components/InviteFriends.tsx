"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Users, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InviteFriends() {
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simular la generación de un enlace de invitación
    setInviteLink(
      `https://tuapp.com/invite/${Math.random().toString(36).substr(2, 8)}`
    );
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Card className="bg-gradient-to-br from-[#800020] to-[#4a0012] text-white shadow-lg">
      <CardHeader>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <CardTitle className="text-3xl font-bold text-[#FFD700] flex items-center justify-center mb-2">
            <Users className="mr-2" />
            Invita a tus amigos
          </CardTitle>
          <CardDescription className="text-[#FFD700]/80">
            Comparte el enlace y gana recompensas increíbles
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent className="px-4 py-6 space-y-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <Input
            value={inviteLink}
            readOnly
            className="bg-white/20 border-[#FFD700]/30 text-white placeholder-white/50 w-full"
          />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={copyToClipboard}
            className="w-full bg-[#FFD700] text-[#800020] hover:bg-white hover:text-[#800020] transition-colors"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center justify-center"
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
                  className="flex items-center justify-center"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar enlace
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-[#FFD700] font-semibold flex items-center justify-center">
            <Sparkles className="mr-2 h-5 w-5" />
            ¡Invita a 5 amigos y obtén un premio especial!
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
