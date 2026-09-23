"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const authErrorMessages: Record<string, string> = {
    Configuration:
      "Erro de configuração no servidor. Verifique as variáveis de ambiente.",
    AccessDenied:
      "Acesso restrito. Este e-mail não possui permissão de administrador.",
    EmailSignInError:
      "Não foi possível enviar o link. Verifique a configuração de e-mail e tente novamente.",
    CallbackRouteError:
      "Não foi possível concluir o login. Confira a configuração do banco de dados e tente novamente.",
    Verification: "O link de acesso expirou ou já foi utilizado. Solicite um novo.",
    unauthorized: "Sessão expirada ou não autorizada. Faça login novamente.",
    forbidden:
      "Acesso restrito. Este e-mail não possui permissão de administrador.",
  };
  const errorMessage = error
    ? authErrorMessages[error] ?? "Ocorreu um erro ao tentar entrar. Tente novamente."
    : submitError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);

    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
        redirectTo: "/admin",
      });
      if (result?.error) {
        setSubmitError(
          authErrorMessages[result.error] ??
            "Ocorreu um erro ao tentar entrar. Tente novamente."
        );
        return;
      }
      setIsSent(true);
    } catch {
      setSubmitError("Ocorreu um erro ao tentar entrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-foreground/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao site
        </Link>

        <div className="glass rounded-2xl p-8 border-white/15">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-white mb-2">
              Russa Tattoo
            </h1>
            <p className="text-sm text-foreground/50">Painel Administrativo</p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-6"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          {isSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <CheckCircle className="w-12 h-12 text-white mx-auto mb-4" />
              <h2 className="font-display text-xl mb-2">
                Verifique o seu e-mail!
              </h2>
              <p className="text-sm text-foreground/50 mb-4">
                Enviámos um link de acesso para{" "}
                <strong className="text-foreground">{email}</strong>
              </p>
              <p className="text-xs text-foreground/30">
                O link expira em 24 horas. Verifique também a pasta de spam.
              </p>
              <Button
                variant="ghost"
                onClick={() => setIsSent(false)}
                className="mt-6 text-white hover:text-white-light"
              >
                Enviar novamente
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-1.5 text-foreground/70"
                >
                  <Mail className="w-3.5 h-3.5" /> E-mail de administração
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSubmitError(null);
                  }}
                  required
                  className="bg-white/5 border-white/10 focus:border-white h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-white hover:bg-zinc-200 hover:text-black text-background font-semibold h-12 rounded-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    A enviar...
                  </>
                ) : (
                  "Enviar Magic Link"
                )}
              </Button>

              <p className="text-xs text-center text-foreground/30">
                Apenas o e-mail autorizado tem acesso ao painel.
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
