import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";

const useRetiros = () => {
  const { data: session } = useSession();

  const createRetiro = async (data: CreateRetiroInterface) => {
    const res = await lotussApi.post("withdrawals", data, {
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });
    return res.data;
  };

  const getRetiros = async (_: number): Promise<RetirosInterface[]> => { // eslint-disable-line @typescript-eslint/no-unused-vars
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
