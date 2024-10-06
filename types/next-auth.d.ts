import NextAuth from "next-auth";

// Extend the built-in session interface
declare module "next-auth" {
  interface Session {
    address?: string; // Add the wallet address to the session
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    address?: string;
  }
}
