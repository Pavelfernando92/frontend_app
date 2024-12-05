// src/components/form-users.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Importa los estilos por defecto de react-phone-input-2
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

const UserRoles = ["USER", "AMBASSADOR", "ADMIN"] as const;

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/ // Asegúrate de que el regex sea compatible
);

export const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingrese un email válido.",
  }),
  password: z
    .string()
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres.",
    })
    .optional(),
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  apellido_paterno: z.string().min(2, {
    message: "El apellido paterno debe tener al menos 2 caracteres.",
  }),
  apellido_materno: z.string().optional(),
  birthday: z.string().refine(
    (date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      const dayDifference = today.getDate() - birthDate.getDate();

      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        return age - 1 >= 18;
      }
      return age >= 18;
    },
    {
      message: "Debe ser mayor de 18 años para registrarse.",
    }
  ),
  telefono: z.string().regex(phoneRegex, {
    message: "Por favor ingrese un número de teléfono válido.",
  }),
  role: z.enum(UserRoles).optional().default("USER"),
});

interface FormUsersProps {
  defaultValues?: z.infer<typeof formSchema>;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
}

const FormUsers: React.FC<FormUsersProps> = ({ defaultValues, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      email: "",
      password: "",
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      birthday: "",
      telefono: "",
      role: UserRoles[0],
    },
  });
  const { toast } = useToast();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          setIsLoading(true);
          try {
            await onSubmit(values);
            toast({
              title: "Éxito",
              description: "La operación se completó exitosamente.",
              variant: "success",
            });
          } catch (error) {
            if (error instanceof AxiosError && error.response) {
              toast({
                title: "Error",
                description: error.response.data.msg,
                variant: "destructive",
              });
            } else {
              toast({
                title: "Error",
                description: "Hubo un problema al procesar la solicitud.",
                variant: "destructive",
              });
            }
          } finally {
            setIsLoading(false);
          }
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="correo@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormDescription>
                La contraseña debe tener al menos 6 caracteres.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Juan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apellido_paterno"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido Paterno</FormLabel>
              <FormControl>
                <Input placeholder="Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apellido_materno"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido Materno</FormLabel>
              <FormControl>
                <Input placeholder="García" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Teléfono</FormLabel>
              <FormControl>
                <PhoneInput
                  country={"mx"}
                  value={field.value}
                  onChange={(value) => field.onChange(`+${value}`)}
                  inputClass="w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol de Usuario</FormLabel>
              <FormControl>
                <select {...field} className="w-full p-2 border rounded-md">
                  <option value="">Selecciona una opción</option>
                  <option value={UserRoles[0]}>Usuario</option>
                  <option value={UserRoles[1]}>Embajador</option>
                  <option value={UserRoles[2]}>Administrador</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Procesando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  );
};

export default FormUsers;
