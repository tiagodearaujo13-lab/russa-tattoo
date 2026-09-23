import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";
import { isAllowedAdminEmail } from "@/lib/admin-auth";

const f = createUploadthing();

/**
 * FileRouter do UploadThing.
 * Define dois endpoints:
 * 1. galleryImage — Upload de fotos na galeria (apenas admin autenticado)
 * 2. referenceImage — Upload de imagens de referência (público, no formulário de booking)
 */
export const ourFileRouter = {
  /**
   * Upload de imagens para a galeria do portfólio.
   * Requer autenticação de admin.
   */
  galleryImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user?.email) {
        throw new Error("Não autenticado.");
      }

      if (!isAllowedAdminEmail(session.user.email)) {
        throw new Error("Acesso negado. Apenas a administradora pode fazer upload.");
      }

      return { uploadedBy: session.user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UploadThing] Galeria upload por:", metadata.uploadedBy);
      console.log("[UploadThing] URL:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),

  /**
   * Upload de imagens de referência para solicitação de tattoo.
   * Público (qualquer visitante pode enviar referência no formulário).
   * Limitado a 4MB.
   */
  referenceImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      return { uploadedBy: "anonymous-client" };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("[UploadThing] Referência upload URL:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
