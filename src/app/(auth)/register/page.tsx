"use client";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { terminosCondiciones } from "@/data/terminos-condiciones";
import { avisoPrivacidad } from "@/data/aviso-privacidad";
import useRegistro from "./hooks/useRegistro";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import Logo from "../../../../public/images/LotusLogoRed.png";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function RegisterPage() {
  const {
    formData,
    loading,
    responseRequest,

    setFormData,
    validateBirthdate,
    registerUser,
  } = useRegistro();

  const [modalOpen, setModalOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (phone: string) => {
    setFormData((prevData) => ({
      ...prevData,
      telefono: `+${phone}`,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      aceptaTerminos: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const correctBirthdate = validateBirthdate(formData.birthday);

    if (!correctBirthdate) {
      setAlertInfo({
        show: true,
        message:
          "La fecha de nacimiento no es válida. Debes ser mayor de 18 años.",
      });
      return;
    }

    if (!formData.aceptaTerminos) {
      setAlertInfo({
        show: true,
        message: "Debes aceptar los términos y condiciones para registrarte.",
      });
      return;
    }

    if (formData.password.length < 6) {
      setAlertInfo({
        show: true,
        message: "La contraseña debe tener al menos 6 caracteres",
      });
      return;
    }
    setAlertInfo({
      show: false,
      message: "",
    });
    await registerUser(formData);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <Card className="w-full max-w-md mx-auto sm:max-w-lg lg:max-w-xl sm:p-6 lg:p-8">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Image
            src={Logo}
            alt="Lotus Logo"
            width={250}
            height={200}
            priority
          />
        </div>
        <CardTitle className="text-2xl font-bold text-center text-[#800020] sm:text-3xl lg:text-4xl">
          Registrarse
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alertInfo.show && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{alertInfo.message}</AlertDescription>
          </Alert>
        )}
        {/* Alertas para mensajes de éxito o error */}
        {responseRequest.msg && (
          <Alert
            variant={responseRequest.error ? "destructive" : "default"}
            className={cn("mb-4", !responseRequest.error && "bg-green-300")}
          >
            {responseRequest.error && <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{responseRequest.error ? "Error" : "Éxito"}</AlertTitle>
            <AlertDescription>{responseRequest.msg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                onChange={handleChange}
                className="focus:ring-[#FF0000]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="**********"
                required
                autoComplete="on"
                onChange={handleChange}
                className="focus:ring-[#FF0000]"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                required
                onChange={handleChange}
                className="focus:ring-[#FF0000]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
              <Input
                id="apellido_paterno"
                name="apellido_paterno"
                required
                onChange={handleChange}
                className="focus:ring-[#FF0000]"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="apellido_materno">Apellido Materno</Label>
              <Input
                id="apellido_materno"
                name="apellido_materno"
                required
                onChange={handleChange}
                className="focus:ring-[#FF0000]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Número de Teléfono</Label>
              <PhoneInput
                country={"mx"}
                value={formData.telefono}
                onChange={handlePhoneChange}
                inputProps={{
                  name: "telefono",
                  required: true,
                  autoFocus: false,
                }}
                placeholder="+523123122500"
                containerStyle={{ width: "100%" }}
                inputStyle={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthday">Fecha de Nacimiento</Label>
            <Input
              id="birthday"
              name="birthday"
              type="date"
              required
              onChange={handleChange}
              className="focus:ring-[#FF0000]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="aceptaTerminos" className="text-sm">
              Acepto los{" "}
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <span
                    className="text-[#d30000] hover:underline cursor-pointer"
                    onClick={openModal}
                  >
                    términos y condiciones
                  </span>
                </DialogTrigger>
                <DialogContent className="max-w-[90%] w-[800px] max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Términos y Condiciones</DialogTitle>
                    <DialogDescription>
                      Por favor, lea atentamente los siguientes términos y
                      condiciones.
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] mt-4">
                    <div className="text-sm">
                      <h2 className="text-lg font-bold mb-2">
                        TÉRMINOS DE SERVICIO
                      </h2>
                      <p className="mb-2">{terminosCondiciones}</p>
                      <h2 className="text-lg font-bold mb-2 mt-2">
                        Aviso de Privacidad
                      </h2>
                      <p>{avisoPrivacidad}</p>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </Label>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#800020] hover:bg-[#491721] text-white"
            disabled={loading}
          >
            Registrarse
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-[#d30000] hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
