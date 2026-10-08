import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.roleId,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        (session.user as any).roleId = token.roleId;
        (session.user as any).activeRoleId = token.activeRoleId;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.roleId = (user as any).roleId;
        token.activeRoleId = (user as any).roleId; // default active role is their actual role
      }
      
      // Allow session update to change activeRoleId (View As)
      if (trigger === "update" && session?.activeRoleId) {
        // Only allow Superadmins (roleId = 1) to switch roles
        if (token.roleId === 1) {
          token.activeRoleId = session.activeRoleId;
        }
      }
      
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
