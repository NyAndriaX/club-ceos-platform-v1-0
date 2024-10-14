import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions, getServerSession } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { getContext } from '@/database/context';
import { compare } from 'bcryptjs';
import { generateEncryptedKey } from '@/app/api/utils/crypto';
import * as userRepository from '@/database/repository/user.repository';
import { sendPaymentLink } from '@/services/paymail.service';
import * as subscriptionRepository from '@/database/repository/subscription.repository';

const { prisma } = getContext();

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'Identifiants',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'johnDoe@gmail.com',
        },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("L'email et le mot de passe sont requis.");
        }

        const user = await userRepository.findUnique({
          email: credentials.email,
        });

        if (!user) {
          throw new Error('Aucun utilisateur trouvé avec cet email.');
        }

        if (user.role === 'ADMIN') {
          const { password, ...userWithoutSensitiveInfo } = user;
          return userWithoutSensitiveInfo as any;
        }

        if (!user.isValidatedByAdmin) {
          throw new Error(
            'Votre compte est en attente de validation par un administrateur.',
          );
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password || '',
        );

        if (!isPasswordValid) {
          throw new Error('Mot de passe invalide.');
        }

        if (!user.subscriptionId) {
          throw new Error(
            'Pour accéder à ce service, vous devez être abonné. Veuillez vérifier votre boîte email pour trouver le lien de paiement.',
          );
        }

        const subscription = await subscriptionRepository.findUnique({
          id: user.subscriptionId,
        });

        if (!subscription) {
          throw new Error(
            'Souscription invalide. Veuillez vous abonner pour accéder à ce service.',
          );
        }

        const currentDate = new Date();
        if (
          subscription.endDate &&
          new Date(subscription.endDate) < currentDate
        ) {
          const expirationTime = 7 * 24 * 60 * 60 * 1000;

          const encryptedKey = await generateEncryptedKey({
            userId: user.id,
            expirationTime: expirationTime,
          });

          const paymentLink = `${process.env.NEXT_PUBLIC_SITE_URL!}/pricing?key=${encryptedKey}`;

          const response = await sendPaymentLink({
            userEmail: user.email,
            paymentLink,
          });

          if (!response.OK) {
            throw new Error("Échec de l'envoi de l'email");
          }
          throw new Error(
            'Votre abonnement a expiré. Nous vous avons envoyé un email contenant le lien pour renouveler votre abonnement.',
          );
        }

        const { password, ...userWithoutSensitiveInfo } = user;
        return userWithoutSensitiveInfo as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }

      // ADDITION
      if (trigger === 'update') {
        token.user = session;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};

/**
 *
 * helpers function to get the  session on the server without having to import the authOptions object every single time
 * @returns  the sessions object or null
 */

const getSession = async () => getServerSession();

export { authOptions, getSession };
