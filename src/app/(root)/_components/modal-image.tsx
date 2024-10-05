import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import lotussApi from "@/lib/axios";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import useUsersStore from "@/store/users.store";

type Props = {
  token: string;
  userId: number;
};

const ModalImage = ({ token, userId }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadedImage, setLoadedImage] = useState<boolean>(false);
  const { setUser } = useUsersStore();

  // Maneja la selección de la imagen
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file); // Guarda la imagen seleccionada
    }
  };

  // Función para manejar la subida de la imagen
  const handleUpload = async () => {
    if (!selectedImage) {
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedImage);

    setLoading(true); // Activa el estado de carga

    try {
      const res = await lotussApi.put(
        `/usuarios/${userId}`,
        formData, // Pasa el formData directamente
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoadedImage(true);
      setIsOpen(false); // Cierra el modal
      setUser(userId, token); // Refresca el usuario con la nueva imagen de perfil
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error de red:", error);
      } else {
        console.error("Error inesperado:", error);
      }
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  useEffect(() => {
    if (!loadedImage && !isOpen) {
      setIsOpen(true);
    }
  }, [loadedImage, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Foto de perfil</DialogTitle>
          <DialogDescription>¡Sube una foto tuya!</DialogDescription>
        </DialogHeader>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="picture">Foto de perfil</Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <Button
          className="mt-4 w-full bg-[#800020] hover:bg-[#491721]"
          onClick={handleUpload}
          disabled={loading}
        >
          Cargar Foto
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ModalImage;
