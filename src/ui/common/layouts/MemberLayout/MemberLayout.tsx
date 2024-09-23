"use client";

import React from "react";
import { TopBar } from "../../components/layout/MemberLayout/TopBar";
import { NavBar } from "../../components/layout/MemberLayout/NavBar";
import "./MemberLayout.modules.css";

type Props = {
  children: React.ReactNode;
};

export const MemberLayout = ({ children }: Props) => {
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex flex-col h-full">
        <TopBar />
        <div className="flex flex-row h-full">
          <NavBar />
          <div className="flex flex-col lg:px-8 py-4 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};
