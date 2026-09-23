import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { isAllowedAdminEmail } from "@/lib/admin-auth";

/**
 * Middleware de segurança para rotas /admin/*.
 * Intercepta TODAS as requisições para o painel administrativo e verifica:
 * 1. Se existe uma sessão JWT válida
 * 2. Se o e-mail da sessão está na lista ADMIN_EMAIL
 *
 * Se qualquer verificação falhar → redirect para /login com código 403.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Apenas protege rotas /admin
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const session = req.auth;

    // Sem sessão → redirect para login
    if (!session?.user?.email) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // E-mail não é o admin → forbidden
    if (!isAllowedAdminEmail(session.user.email)) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("error", "forbidden");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
