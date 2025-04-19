"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import usePromociones from "../hooks/usePromociones";
import { PromocionInterface } from "../interface/promocion.interface";
import { useToast } from "@/hooks/use-toast";

// --- Zod schema ---
const promocionSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  validUntil: z.coerce.date({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "Fecha inválida",
  }),
  status: z.boolean().optional(), // solo requerido en edición
});

type PromocionFormValues = z.infer<typeof promocionSchema>;

export function PromocionForm() {
  const router = useRouter();
  const { promotionId } = useParams();
  const { getPromocion, createPromotion, updatePromotion } = usePromociones();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [promocion, setPromocion] = useState<PromocionInterface | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PromocionFormValues>({
    resolver: zodResolver(promocionSchema),
    defaultValues: {
      title: "",
      description: "",
      validUntil: new Date(),
      status: true,
    },
  });

  useEffect(() => {
    const fetchPromocion = async () => {
      if (promotionId !== null && promotionId !== undefined) {
        setIsEditing(true);
        const promocionFetch = await getPromocion(Number(promotionId));
        setPromocion(promocionFetch);

        const formattedDate = new Date(promocionFetch.validUntil)
          .toISOString()
          .split("T")[0];

        reset({
          title: promocionFetch.title,
          description: promocionFetch.description,
          validUntil: formattedDate as unknown as Date,
          status: promocionFetch.status,
        });
      }
    };
    fetchPromocion();
  }, [promotionId, reset]);

  const onSubmit = async (values: PromocionFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && promocion) {
        await updatePromotion(promocion.id, values);
        toast({
          title: "Promoción actualizada",
          description: "La promoción se ha actualizado correctamente.",
          variant: "success",
        });
        router.push("/admin/promociones");
      } else {
        await createPromotion(values);
        toast({
          title: "Promoción creada",
          description: "La promoción se ha creado correctamente.",
          variant: "success",
        });
        router.push("/admin/promociones");
      }
      router.refresh();
    } catch (err) {
      console.error("Error al guardar la promoción:", err);
      toast({
        title: "Error",
        description: "Error al guardar la promoción",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Promoción" : "Nueva Promoción"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Título de la promoción"
            />
            {errors.title && <ErrorMessage message={errors.title.message || ""} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe la promoción"
              rows={4}
            />
            {errors.description && (
              <ErrorMessage message={errors.description.message || ""} />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="validUntil">Válida hasta</Label>
            <Input id="validUntil" type="date" {...register("validUntil")} />
            {errors.validUntil && (
              <ErrorMessage message={errors.validUntil.message || ""} />
            )}
          </div>

          {isEditing && (
            <div className="flex items-center space-x-2">
              <input
                id="isActive"
                type="checkbox"
                {...register("status")}
                defaultChecked={promocion?.status}
              />
              <Label htmlFor="isActive">¿Promoción activa?</Label>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size={16} className="mr-2" />
                {isEditing ? "Actualizando..." : "Creando..."}
              </>
            ) : isEditing ? (
              "Actualizar"
            ) : (
              "Crear"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
