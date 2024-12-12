import type { Metadata, ResolvingMetadata } from "next";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import lotussApi from "@/lib/axios";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const userOnline = await getServerSession(authOptions);
  const userImage = await lotussApi(`usuarios/${userOnline?.user.id}`, {
    headers: {
      Authorization: `Bearer ${userOnline?.user.token}`,
    },
  });

  return {
    title: "ScratchRoom",
    openGraph: {
      title: "Lotuss México - ScratchRoom",
      description: `
      ¡Ven y juega ScratchRoom para ganarte premios! \r
      🍀Gané en ScrathRoom!🍀
      `,
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
