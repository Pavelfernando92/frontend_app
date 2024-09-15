"use client";
import { useEffect } from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAdmin from "../hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import CardSkeleton from "./CardSkeleton";

const TotalUsers = () => {
  const { totalUsers, loading, getTotalUsers } = useAdmin();

  useEffect(() => {
    getTotalUsers();
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de usuarios
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        {loading ? (
          <CardSkeleton />
        ) : (
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default TotalUsers;
