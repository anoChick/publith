import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '~/server/prisma';

export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: `${process.env.TWITTER_ID}`,
      clientSecret: `${process.env.TWITTER_SECRET}`,
      version: '2.0',
    }),
  ],
  secret: process.env.SECRET,
  //   pages: {
  //     signIn: `/login`,
  //     verifyRequest: `/login`,
  //     error: '/login', // Error code passed in query string as ?error=
  //   },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: ({ session, user }: any) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          username: user.username,
          active: user.active,
          registered: user.registered,
          lastAgreedTermsOn: user.lastAgreedTermsOn,
        },
      };
    },
  },
};

export default NextAuth(authOptions);
