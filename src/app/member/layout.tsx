import React from "react";
import MemberLayout from "@/features/app/pages/member/layout";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  return <MemberLayout>{children}</MemberLayout>;
};

export default Layout;
