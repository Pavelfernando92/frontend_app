"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { usePromocionesStore } from "@/store/promociones.store";
import { PromocionInterface } from "../interface/promocion.interface";

const promocionSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  validUntil: z.date({
    required_error: "La fecha de validez es requerida",
  }),
  status: z.boolean().default(true),
  image: z.instanceof(File).optional(),
});

type PromocionFormData = z.infer<typeof promocionSchema>;

interface Props {
  promotion?: PromocionInterface;
}

const PromocionForm = ({ promotion }: Props) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { createPromotion, updatePromotion, fetchPromociones } = usePromocionesStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    promotion?.image || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PromocionFormData>({
    resolver: zodResolver(promocionSchema),
    defaultValues: {
      title: promotion?.title || "",
      description: promotion?.description || "",
      status: promotion?.status ?? true,
    },
  });

  const titleValue = watch("title");

  useEffect(() => {
    if (titleValue) {
      setValue("description", titleValue);
    }
  }, [titleValue, setValue]);

  const onSubmit = async (values: PromocionFormData) => {
    if (!session?.user.token) {
      toast({
        title: "Error",
        description: "No tienes autorización para realizar esta acción.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (promotion) {
        // Actualizar promoción existente
        const updateData: any = {
          title: values.title,
          description: values.description,
          validUntil: values.validUntil.toISOString().split('T')[0],
          status: values.status,
        };

        if (values.image) {
          updateData.image = values.image;
        }

        await updatePromotion(promotion.id, updateData, session.user.token);
        
        toast({
          title: "Promoción actualizada",
          description: "La promoción se ha actualizado correctamente.",
          variant: "success",
        });
      } else {
        // Crear nueva promoción
        const createData: any = {
          title: values.title,
          description: values.description,
          validUntil: values.validUntil.toISOString().split('T')[0],
        };

        if (values.image) {
          createData.image = values.image;
        }

        await createPromotion(createData, session.user.token);
        
        toast({
          title: "Promoción creada",
          description: "La promoción se ha creado correctamente.",
          variant: "success",
        });
      }

      // Refrescar la lista de promociones
      await fetchPromociones(session.user.token);
      
      router.push("/admin/promociones");
    } catch (error) {
      console.error("Error al guardar la promoción:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la promoción. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue("image", undefined);
    setImagePreview(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {promotion ? "Editar Promoción" : "Crear Nueva Promoción"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Título */}
        <div>
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Ingresa el título de la promoción"
            className="mt-1"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Imagen */}
        <div>
          <Label htmlFor="image">Imagen</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1"
          />
          {imagePreview && (
            <div className="mt-3 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
              >
                ×
              </Button>
            </div>
          )}
        </div>

        {/* Fecha de validez */}
        <div>
          <Label htmlFor="validUntil">Válido hasta *</Label>
          <Input
            id="validUntil"
            type="date"
            {...register("validUntil", {
              valueAsDate: true,
            })}
            className="mt-1"
          />
          {errors.validUntil && (
            <p className="text-red-500 text-sm mt-1">
              {errors.validUntil.message}
            </p>
          )}
        </div>

        {/* Estatus */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="status"
            {...register("status")}
            defaultChecked={promotion?.status ?? true}
          />
          <Label htmlFor="status">Promoción activa</Label>
        </div>

        {/* Descripción oculta - se llena automáticamente con el título */}
        <div className="hidden">
          <Textarea
            {...register("description")}
            value={titleValue || ""}
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {promotion ? "Actualizando..." : "Creando..."}
              </>
            ) : (
              promotion ? "Actualizar Promoción" : "Crear Promoción"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/promociones")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PromocionForm;
