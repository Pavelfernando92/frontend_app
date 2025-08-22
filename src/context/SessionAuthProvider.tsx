"use client";

import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

const SessionAuthProvider = ({ children }: Props) => {
  return <SessionProvider refetchInterval={60} refetchOnWindowFocus={true}>{children}</SessionProvider>;
};

export default SessionAuthProvider;
