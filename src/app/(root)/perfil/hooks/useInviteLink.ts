import { INVITATION_CODE } from "@/constants";
import lotussApi from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";

// Hook para manejar la invitación
const useInviteLink = (session: any, origin: string) => {
  const [inviteLink, setInviteLink] = useState("");

  const createInvitation = useCallback(
    async (userId: number, token: string) => {
      try {
        const response = await lotussApi.post(
          "/invitations",
          { userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const { code } = response.data.invitation;
        setInviteLink(code);
      } catch (error) {
        console.error("Error creando la invitación:", error);
      }
    },
    []
  );

  useEffect(() => {
    if (session?.user?.id && session?.user?.token) {
      createInvitation(session.user.id, session.user.token);
    }
  }, [session, createInvitation]);

  const invitationUrl = `${origin}/register?${INVITATION_CODE}=${inviteLink}`;

  return { inviteLink, invitationUrl };
};

export default useInviteLink;
