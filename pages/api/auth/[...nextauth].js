import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/init/prisma";
import { Argon2id } from "oslo/password";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error('Invalid email or password');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        const validPassword = await new Argon2id().verify(
          user.hashedPassword,
          credentials.password
        );

        if (!validPassword) {
          throw new Error('Invalid email or password');
        }

        if (!user.isActive) {
          throw new Error('User is not active');
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      const dbUser = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
      });

      if (!dbUser) {
        return null;
      }

      if (session.user) {
        session.user.id = token.sub;
        session.user.role = dbUser.role;
      }

      return session;
    },
  },
});
