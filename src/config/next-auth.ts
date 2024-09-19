import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getContext } from "@/database/context";
import { compare } from "bcryptjs";
import * as userRepository from "@/database/repository/user.repository";

const { prisma } = getContext();

export const AuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "johnDoe@gmail.com" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("L'email et le mot de passe sont requis.");
        }

        const user = await userRepository.findUnique({ email: credentials.email });

        if (!user) {
          throw new Error("Aucun utilisateur trouvé avec cet email.");
        }

        if (user.role === 'ADMIN') {
          const { password, ...userWithoutSensitiveInfo } = user;
          return userWithoutSensitiveInfo as any;
        }

        if (!user.isValidatedByAdmin) {
          throw new Error("Votre compte est en attente de validation par un administrateur.");
        }

        const isPasswordValid = await compare(credentials.password, user.password || "");

        if (!isPasswordValid) {
          throw new Error("Mot de passe invalide.");
        }

        if (!user.subscriptionId) {
          throw new Error("Vous devez être abonné pour accéder à ce service.");
        }

        const subscription = await prisma.subscription.findUnique({
          where: { id: user.subscriptionId },
        });

        if (!subscription) {
          throw new Error("Souscription invalide. Veuillez vous abonner pour accéder à ce service.");
        }

        const { password, ...userWithoutSensitiveInfo } = user;
        return userWithoutSensitiveInfo as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};
