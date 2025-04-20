"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import Logo from "../../../../public/images/LotusLogoRed.png";
import LandingPage from "../_components/landing-page";
import { useLoginStore } from "@/store/useLoginStore";

export default function LoginPage() {
  const router = useRouter();
  const { showLogin, setShowLogin } = useLoginStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [alertInfo, setAlertInfo] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (!res?.ok) {
        setAlertInfo({
          show: true,
          message: "Credenciales incorrectas. Por favor, inténtalo de nuevo.",
        });
        return;
      }
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showLogin && (
        <div className="flex justify-center items-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <Image src={Logo} alt="LOTUSS Logo" width={250} height={200} />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-[#800020]">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-center">
                Ingresa a tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alertInfo.show && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{alertInfo.message}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    onChange={handleChange}
                    className="text-lg md:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="******"
                    autoComplete="on"
                    required
                    onChange={handleChange}
                    className="text-lg md:text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#800020] hover:bg-[#491721] text-white"
                  disabled={loading}
                >
                  Iniciar Sesión
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                ¿Aún no tienes cuenta?{" "}
                <Link
                  href="/register"
                  className="text-[#d30000] hover:underline"
                >
                  Regístrate
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      )}

      {!showLogin && <LandingPage/>}
    </>
  );
}
