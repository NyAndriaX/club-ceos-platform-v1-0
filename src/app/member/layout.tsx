import React from "react";
import { MemberLayout } from "@/ui/common/layouts/MemberLayout/MemberLayout";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return <MemberLayout>{children}</MemberLayout>;
};

export default Layout;
