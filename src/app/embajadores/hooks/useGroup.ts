// hooks/useGroup.ts
import lotussApi from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

const useGroup = () => {
  const { data: session } = useSession();
  const URL = "/ambassadors";

  const addUserToEmbassadorGroup = useCallback(
    async (userId: number, ambassadorId: number) => {
      try {
        const res = await lotussApi.post(
          `${URL}/add-user`,
          { userId, ambassadorId },
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.log(`Error al agregar usuario al grupo: ${error}`);
      }
    },
    [session?.user?.token]
  );

  const getGroupMembers = useCallback(
    async (ambassadorId: number) => {
      try {
        const res = await lotussApi(`${URL}/${ambassadorId}`, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        });
        return res.data.groupMembers;
      } catch (error) {
        console.log(`Error al obtener crecimiento del grupo: ${error}`);
      }
    },
    [session?.user?.token]
  );

  const getQuantityGroupMembers = useCallback(
    async (ambassadorId: number) => {
      try {
        const res = await lotussApi(`${URL}/${ambassadorId}`, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        });
        return res.data.groupMembers.length;
      } catch (error) {
        console.log(`Error al obtener cantidad del grupo: ${error}`);
      }
    },
    [session?.user?.token]
  );

  const getGroupGrowth = useCallback(
    async (ambassadorId: number) => {
      try {
        const res = await lotussApi(`${URL}/${ambassadorId}/growth`, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        });
        return res.data.growth;
      } catch (error) {
        console.log(`Error al obtener el grupo: ${error}`);
      }
    },
    [session?.user?.token]
  );

  const getTotalCreditsGroupPerMonth = useCallback(
    async (ambassadorId: number) => {
      try {
        const res = await lotussApi(`${URL}/${ambassadorId}/total-credits`, {
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
        });
        return res.data.totalCredits;
      } catch (error) {
        console.log(`Error al total de creditos del grupo: ${error}`);
      }
    },
    [session?.user?.token]
  );

  return {
    addUserToEmbassadorGroup,
    getQuantityGroupMembers,
    getGroupGrowth,
    getGroupMembers,
    getTotalCreditsGroupPerMonth,
  };
};

export default useGroup;
