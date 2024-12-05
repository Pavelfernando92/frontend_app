import { INVITATION_CODE } from "@/constants";
import lotussApi from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";

const useInviteLink = (
  session: any,
  origin: string,
  launchConfetti?: () => void
) => {
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

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

  const handleCopyToClipboard = async () => {
    const message = `
    🌟 ¡Únete a Lotuss! Regístrate usando el código: ${inviteLink} 🌟\n\n🔗 ${invitationUrl}
    `;

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        if (launchConfetti) launchConfetti();
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
        fallbackCopyToClipboard(message);
      }
    } else {
      fallbackCopyToClipboard(message);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      if (launchConfetti) launchConfetti();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Fallback: Unable to copy text", err);
    }
    document.body.removeChild(textarea);
  };

  return { inviteLink, invitationUrl, handleCopyToClipboard, copied };
};

export default useInviteLink;
