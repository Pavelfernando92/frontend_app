"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import TotalUsers from "./_components/TotalUsers";

const AdminPage = () => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  return (
    <>
      <h1 className="text-3xl font-semibold mb-6">
        {isLoading ? (
          <Skeleton className="h-9 w-[300px]" />
        ) : (
          `Bienvenido, ${session?.user.nombre}`
        )}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <TotalUsers />
      </div>
    </>
  );
};

export default AdminPage;
