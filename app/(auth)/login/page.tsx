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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1A1A1A] px-4 py-12 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.055),transparent_68%)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back to home */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-tatuadora text-[10px] uppercase tracking-[0.25em] text-[#CCCCCC]/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar ao atelier
        </Link>

        <div className="border border-[#CCCCCC]/15 bg-[#222222]/90 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-10">
          <div className="mb-9 text-center">
            <p className="mb-2 font-tatuadora text-[9px] font-light uppercase tracking-[0.3em] text-[#808080]">
              Área administrativa privada
            </p>
            <h1 className="font-russa text-4xl font-semibold tracking-wide text-white sm:text-5xl">
              RUSSA
            </h1>
            <p className="mt-1 font-tatuadora text-[9px] uppercase tracking-[0.4em] text-[#9E9E9E]">
              Tatuadora
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-2 border border-red-500/30 bg-[#1A1A1A] p-3.5 font-tatuadora text-xs leading-relaxed tracking-wide text-[#DCDCDC]"
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
              <CheckCircle className="mx-auto mb-4 h-10 w-10 text-[#DCDCDC]" />
              <h2 className="mb-2 font-russa text-2xl text-white">
                Verifique o seu e-mail!
              </h2>
              <p className="mb-4 font-tatuadora text-sm font-light leading-relaxed text-[#B8B8B8]">
                Enviámos um link de acesso para{" "}
                <strong className="break-all font-medium text-white">{email}</strong>
              </p>
              <p className="font-tatuadora text-[10px] uppercase tracking-[0.16em] text-[#808080]">
                O link expira em 24 horas. Verifique também a pasta de spam.
              </p>
              <Button
                variant="ghost"
                onClick={() => setIsSent(false)}
                className="mt-6 border border-white/20 font-tatuadora text-[10px] uppercase tracking-[0.2em] text-[#DCDCDC] hover:border-white hover:bg-white hover:text-[#1A1A1A]"
              >
                Enviar novamente
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 font-tatuadora text-[10px] uppercase tracking-[0.18em] text-[#B8B8B8]"
                >
                  <Mail className="h-3.5 w-3.5 text-[#9E9E9E]" /> E-mail de administração
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
                  className="h-12 rounded-none border-[#CCCCCC]/25 bg-[#1A1A1A] font-tatuadora text-sm text-white placeholder:text-[#707070] focus:border-white focus:ring-0"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="h-12 w-full rounded-none border border-white bg-white font-tatuadora text-[10px] font-semibold uppercase tracking-[0.25em] text-[#1A1A1A] transition-colors hover:bg-[#CCCCCC] hover:text-[#1A1A1A]"
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

              <p className="text-center font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#808080]">
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
        <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A]">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
