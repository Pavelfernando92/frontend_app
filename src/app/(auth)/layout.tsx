"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SkeletonAuth from "./_components/SkeletonAuth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: _, status } = useSession(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <SkeletonAuth />
      </div>
    );
  }

  if (status === "authenticated") {
    // Retorna null mientras se redirige
    return null;
  }

  return (
    <div>
      {children}
    </div>
  );
}
