"use client";

import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

const RootPage = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100">
        <Skeleton />
      </div>
    );
  }
  return <div>RootPage</div>;
};

export default RootPage;
