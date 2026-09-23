import NextAuth from "next-auth";
import ResendProvider from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import {
  users as dbUsers,
  accounts as dbAccounts,
  verificationTokens as dbVerificationTokens,
} from "@/lib/db/schema";
import { emailFrom } from "@/lib/resend";

const resendProvider = ResendProvider({
  apiKey: process.env.RESEND_API_KEY?.trim(),
  from: emailFrom,
});

/**
 * Configuração central do Auth.js v5 (NextAuth).
 * - Provider: Magic Link via e-mail (Resend como transport)
 * - Adapter: Drizzle para persistir sessões no Neon PostgreSQL
 * - Strategy: JWT (mais performante em serverless, sem DB lookup por request)
 * - Guard: Apenas ADMIN_EMAIL pode fazer login
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: dbUsers,
    accountsTable: dbAccounts,
    verificationTokensTable: dbVerificationTokens,
  }),
  trustHost: true,
  providers: [
    {
      ...resendProvider,
      async sendVerificationRequest(params) {
        try {
          await resendProvider.sendVerificationRequest(params);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown Resend error";
          console.error(
            "[AUTH_RESEND_ERROR]:",
            message.replace(/re_[A-Za-z0-9_-]+/g, "re_***")
          );
          throw error;
        }
      },
    },
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    /**
     * Guard: Bloqueia login para qualquer e-mail diferente do ADMIN_EMAIL.
     * Esta é a primeira camada de defesa — o middleware é a segunda.
     */
    async signIn({ user }) {
      const adminEmailsEnv = process.env.ADMIN_EMAIL ?? "";
      const allowedAdmins = adminEmailsEnv
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);

      const userEmail = user.email?.trim().toLowerCase();

      if (allowedAdmins.length === 0 || !userEmail) {
        if (allowedAdmins.length === 0) {
          console.error("[Auth] ADMIN_EMAIL não configurado nas variáveis de ambiente.");
        }
        return false;
      }

      return allowedAdmins.includes(userEmail);
    },

    /**
     * Adiciona o e-mail ao token JWT para uso no middleware.
     */
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },

    /**
     * Injeta o e-mail do token na sessão do cliente.
     */
    async session({ session, token }) {
      if (session.user && typeof token.email === "string") {
        session.user.email = token.email;
      }
      return session;
    },
  },
});
