"use client";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TotalUsers = () => {
  const { data: session, status } = useSession();
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await lotussApi("/usuarios", {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      setTotalUsers(res.data.length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [session?.user.token]);

  useEffect(() => {
    if (status === "authenticated") {
      getData();
    }
  }, [status, getData]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de usuarios
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? <Skeleton className="h-8 w-20" /> : totalUsers}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TotalUsers;
