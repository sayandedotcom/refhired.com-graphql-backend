import { authOptions } from "@refhiredcom/features/auth/lib/auth";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

// import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions as NextAuthOptions);

export { handler as GET, handler as POST };
