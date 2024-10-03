import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useRetiros = () => {
  const { data: session, status } = useSession();

  const createRetiro = async (data: CreateRetiroInterface) => {
    const res = await lotussApi.post("withdrawals", data, {
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });
    return res.data;
  };

  const getRetiros = async (id: number): Promise<RetirosInterface[]> => {
    const res = await lotussApi("withdrawals", {
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });

    return res.data;
  };

  return {
    createRetiro,
    getRetiros,
  };
};

export default useRetiros;
