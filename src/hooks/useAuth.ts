import { useSession, signIn, signOut } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string) => {
    await signIn('credentials', { redirect: false, email, password });
  };
  const logout = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  return {
    user: session?.user,
    loading: status === 'loading',
    login,
    logout,
  };
};
