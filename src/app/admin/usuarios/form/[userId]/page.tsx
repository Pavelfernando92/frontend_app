"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import lotussApi from "@/lib/axios";
import { z } from "zod";
import FormUsers, { formSchema } from "../_components/form-users";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

// Infieres el tipo a partir del esquema
type FormValues = z.infer<typeof formSchema>;

export default function UpdateUserPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { userId } = useParams();
  const [defaultValues, setDefaultValues] = useState<FormValues | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUser = async () => {
        try {
          const { data } = await lotussApi.get(`/usuarios/${userId}`, {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          });
          // Convierte la fecha a 'yyyy-MM-dd'
          const formattedDate = new Date(data.birthday)
            .toISOString()
            .split("T")[0];
          setDefaultValues({
            ...data,
            birthday: formattedDate,
          });
        } catch (error) {
          console.error("Failed to fetch user", error);
        }
      };
      fetchUser();
    }
  }, [status, userId]);

  const handleSubmit = async (values: FormValues) => {
    await lotussApi.put(`/usuarios/${userId}`, values, {
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });
    router.push("/admin/usuarios");
  };

  if (!defaultValues) {
    return (
      <div className="space-y-4">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  return <FormUsers defaultValues={defaultValues} onSubmit={handleSubmit} />;
}
