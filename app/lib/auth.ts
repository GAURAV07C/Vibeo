import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn(params) {
      if (!params.user?.email) {
        return false;
      }

      try {
        await prisma.user.create({
          data: {
            email: params.user.email,
            provider: "Google",
          },
        });
      } catch (e) {
        console.log("error", e);
        return false;
      }

      return true;
    },
  },
});
