"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export const MemberLayout = ({ children }: Props) => {
  return <div className="w-full h-screen flex flex-col">{children}</div>;
};
