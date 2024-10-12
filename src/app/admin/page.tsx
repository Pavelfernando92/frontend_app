import { getServerSession } from "next-auth";
import TotalUsers from "./_components/TotalUsers";

import { redirect } from "next/navigation";
import authOptions from "@/lib/authOptions";

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return (
    <>
      <h1 className="text-3xl font-semibold mb-6">
        Bienvenido, {session.user.nombre}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <TotalUsers />
      </div>
    </>
  );
};

export default AdminPage;
