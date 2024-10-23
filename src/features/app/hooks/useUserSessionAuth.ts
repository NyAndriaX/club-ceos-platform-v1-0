import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export const useUserSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const sessionData = await getSession();
      setSession(sessionData);
      setLoading(false);
    };

    fetchSession();
  }, [])

  return { session, loading };
};
