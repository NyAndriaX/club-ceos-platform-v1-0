import React from "react";
import MainNavigation from "../../components/layout/MainLayout/navigation/MainNavigation";
import MainFooter from "../../components/layout/MainLayout/footer/MainFooter";

type Props = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  return (
    <main className="xl:mx-auto min-h-screen">
      <section className="flex flex-col">
        <MainNavigation />
        <div className="w-full">{children}</div>
        <MainFooter />
      </section>
    </main>
  );
};
