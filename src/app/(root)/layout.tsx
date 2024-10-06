"use client";

import { useEffect } from "react";
import Nav from "./_components/Nav";
import Footer from "./_components/footer";
import { useSession } from "next-auth/react";
import useUsersStore from "@/store/users.store";

type Props = {
  children: React.ReactNode;
};

const LayoutRoot = ({ children }: Props) => {
  const { data: session, status } = useSession();
  const { user, setUser } = useUsersStore();

  useEffect(() => {
    const updateUser = async () => {
      if (session && status === "authenticated" && !user) {
        setUser(session.user.id, session.user.token);
      }
    };

    updateUser();
  }, [session, status, user]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#800020] to-[#FF0000] text-white">
      <Nav />
      {children}
      <Footer />
    </main>
  );
};

export default LayoutRoot;
