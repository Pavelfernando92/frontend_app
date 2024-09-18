import { getServerSession } from "next-auth";
import Nav from "./_components/Nav";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};
const LayoutRoot = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return (
    <main className="min-h-screen bg-gray-100">
      <Nav />
      {children}
    </main>
  );
};

export default LayoutRoot;
