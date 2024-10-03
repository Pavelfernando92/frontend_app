// src/app/form/page.tsx
"use client";
import { useRouter } from "next/navigation";
import lotussApi from "@/lib/axios";
import { z } from "zod";
import FormUsers, { formSchema } from "./_components/form-users";

// Infieres el tipo a partir del esquema
type FormValues = z.infer<typeof formSchema>;

export default function CreateUserPage() {
  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    await lotussApi.post("/auth/register", values);
    router.push("/admin/usuarios");
  };

  return <FormUsers onSubmit={handleSubmit} />;
}
