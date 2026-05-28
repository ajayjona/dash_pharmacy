import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      title?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    title?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    title?: string | null;
    image?: string | null;
  }
}
