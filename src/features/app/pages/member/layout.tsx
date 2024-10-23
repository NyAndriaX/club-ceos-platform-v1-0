import React from "react";
import { getSession } from "next-auth/react";
import { AuthProvider } from "../../context/AuthProvider";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await getSession();

  return <AuthProvider session={session}>{children}</AuthProvider>;
};

export default Layout;
