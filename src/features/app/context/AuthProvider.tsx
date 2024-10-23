"use client";

import React, { useState, ReactNode } from "react";
import { Session } from "../types/session";
import AuthContext from "./AuthContext";

export interface AuthContextProps {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

interface AuthProviderProps {
  children: ReactNode;
  session: Session | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  session,
}) => {
  const [currentSession, setCurrentSession] = useState<Session | null>(session);

  return (
    <AuthContext.Provider
      value={{ session: currentSession, setSession: setCurrentSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};
