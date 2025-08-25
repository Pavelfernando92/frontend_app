// hooks/useRetiros.ts
import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

const useRetiros = () => {
  const { data: session } = useSession();

  const createRetiro = useCallback(
    async (data: CreateRetiroInterface) => {
      const res = await lotussApi.post("withdrawals", data, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      return res.data;
    },
    [session?.user?.token]
  );

  const getRetiros = useCallback(async (): Promise<RetirosInterface[]> => {
    const res = await lotussApi("withdrawals", {
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });
    return res.data;
  }, [session?.user?.token]);

  return {
    createRetiro,
    getRetiros,
  };
};

export default useRetiros;
