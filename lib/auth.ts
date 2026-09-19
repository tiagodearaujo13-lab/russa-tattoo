import NextAuth from "next-auth";
import ResendProvider from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { emailFrom } from "@/lib/resend";

/**
 * Configuração central do Auth.js v5 (NextAuth).
 * - Provider: Magic Link via e-mail (Resend como transport)
 * - Adapter: Drizzle para persistir sessões no Neon PostgreSQL
 * - Strategy: JWT (mais performante em serverless, sem DB lookup por request)
 * - Guard: Apenas ADMIN_EMAIL pode fazer login
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    ResendProvider({
      apiKey: process.env.RESEND_API_KEY,
      from: emailFrom,
    }),
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
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) {
        console.error("[Auth] ADMIN_EMAIL não configurado nas variáveis de ambiente.");
        return false;
      }
      return user.email?.toLowerCase() === adminEmail.toLowerCase();
    },

    /**
     * Adiciona o e-mail ao token JWT para uso no middleware.
     */
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },

    /**
     * Injeta o e-mail do token na sessão do cliente.
     */
    async session({ session, token }) {
      if (token.email) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
