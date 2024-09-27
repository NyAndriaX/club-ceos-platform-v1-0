import React from "react";
import { getSession } from "next-auth/react";
import SessionProviderClient from "@/ui/common/components/SessionProviderClient";
import { MemberLayout } from "@/ui/common/layouts/MemberLayout/MemberLayout";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const session = await getSession();
  return (
    <SessionProviderClient session={session}>
      <MemberLayout>{children}</MemberLayout>
    </SessionProviderClient>
  );
};

export default Layout;
