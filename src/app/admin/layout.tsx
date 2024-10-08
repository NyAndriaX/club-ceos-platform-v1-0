import React from "react";
import { AdminLayout } from "@/ui/common/layouts/AdminLayout/AdminLayout";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default Layout;
