import type { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import lotussApi from "@/lib/axios";

export async function generateMetadata(): Promise<Metadata> {
  const userOnline = await getServerSession(authOptions);
  const userImage = await lotussApi(`usuarios/${userOnline?.user.id}`, {
    headers: {
      Authorization: `Bearer ${userOnline?.user.token}`,
    },
  });

  return {
    title: "ScratchRoom",
    description: "¡Ven y juega ScratchRoom para ganarte premios!",
    openGraph: {
      title: "Lotuss México - ScratchRoom",
      description:
        "¡Ven y juega ScratchRoom para ganarte premios! 🍀Gané en ScrathRoom!🍀",
      type: "website",
      url: "https://lotuss.mx/game",
      images: [
        {
          url: userImage.data.profilePicture,
          width: 1200,
          height: 630,
          alt: "Perfil del usuario en Lotuss",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Lotuss México - ScratchRoom",
      description: "¡Ven y juega ScratchRoom para ganarte premios!",
      images: [userImage.data.profilePicture],
    },
  };
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
