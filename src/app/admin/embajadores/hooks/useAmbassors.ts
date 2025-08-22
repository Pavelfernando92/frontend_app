import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";

const useAmbassors = () => {
  const { data: session } = useSession();
  const [ambassors, setAmbassors] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const URL = "ambassadors"

  const getAmbassors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await lotussApi(URL, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      });
      setAmbassors(res.data);
    } catch (error) {
      console.error("Error al obtener los embajadores");
    } finally {
      setLoading(false);
    }
  }, [session?.user.token]);

  useEffect(() => {
    if (!session) return;
    getAmbassors();
  }, [session, getAmbassors]);

  return {
    loading,
    ambassors,
  };
};

export default useAmbassors;
