"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Star,
  StarOff,
  Loader2,
  ImagePlus,
  Sparkles,
  Tag,
  Check,
} from "lucide-react";
import {
  createGalleryItem,
  deleteGalleryItem,
  toggleFeaturedItem,
} from "@/lib/actions/gallery.actions";
import { normalizeCategory } from "@/lib/utils/taxonomy";

export type AdminGalleryItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  categorySlug: string;
  imageUrl: string;
  imageKey: string;
  featured: boolean;
  createdAt: Date;
};

export type CategoryOption = {
  name: string;
  slug: string;
  count: number;
};

type GalleryUploaderProps = {
  items: AdminGalleryItem[];
  existingCategories?: CategoryOption[];
};

const DEFAULT_CATEGORY_SUGGESTIONS = [
  "Fine Line",
  "Botânica",
  "Micro-realismo",
  "Floral Delicado",
  "Lettering",
  "Blackwork",
  "Minimalista",
  "Arte Autoral",
];

export default function GalleryUploader({
  items,
  existingCategories = [],
}: GalleryUploaderProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    imageUrl: "",
    imageKey: "",
    featured: false,
  });

  // Lista unificada de sugestões sem duplicatas
  const combinedSuggestions = Array.from(
    new Set([
      ...existingCategories.map((c) => c.name),
      ...DEFAULT_CATEGORY_SUGGESTIONS,
    ])
  );

  const normalizedPreview = formData.category.trim()
    ? normalizeCategory(formData.category)
    : null;

  const handleCreate = async () => {
    setErrorMessage(null);
    if (!formData.title.trim()) {
      setErrorMessage("Informe o título da obra.");
      return;
    }
    if (!formData.category.trim()) {
      setErrorMessage("Informe ou selecione uma categoria/estilo.");
      return;
    }
    if (!formData.imageUrl || !formData.imageKey) {
      setErrorMessage("Por favor, faça o upload da imagem da obra.");
      return;
    }

    setIsLoading("create");
    try {
      await createGalleryItem({
        title: formData.title.trim(),
        category: formData.category.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl,
        imageKey: formData.imageKey,
        featured: formData.featured,
      });

      setIsCreateOpen(false);
      setFormData({
        title: "",
        category: "",
        description: "",
        imageUrl: "",
        imageKey: "",
        featured: false,
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error("[GalleryUploader] Erro ao criar:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao cadastrar obra."
      );
    } finally {
      setIsLoading(null);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta obra e purgar a imagem?")) {
      return;
    }
    setIsLoading(id);
    try {
      await deleteGalleryItem(id);
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error("[GalleryUploader] Erro ao remover:", err);
      alert(err instanceof Error ? err.message : "Erro ao excluir obra.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    setIsLoading(`feat-${id}`);
    try {
      await toggleFeaturedItem(id);
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error("[GalleryUploader] Erro ao alternar destaque:", err);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra Superior de Ações e Resumo de Taxonomia */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-[#CCCCCC]/15 bg-[#141414] p-5">
        <div>
          <h2 className="font-russa text-xl font-bold text-white">
            Obras Cadastradas ({items.length})
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="font-tatuadora text-[9px] uppercase tracking-[0.2em] text-[#808080] mr-1">
              Estilos Ativos:
            </span>
            {existingCategories.length === 0 ? (
              <span className="font-tatuadora text-[9px] text-[#666666] italic">
                Nenhum estilo catalogado
              </span>
            ) : (
              existingCategories.map((cat) => (
                <Badge
                  key={cat.slug}
                  variant="outline"
                  className="rounded-none border-[#CCCCCC]/20 bg-[#1A1A1A] font-tatuadora text-[8px] uppercase tracking-[0.14em] text-[#CCCCCC]"
                >
                  {cat.name} ({cat.count})
                </Badge>
              ))
            )}
          </div>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-none border border-white bg-white px-5 py-2.5 font-tatuadora text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A] transition-all hover:bg-[#CCCCCC] hover:text-[#1A1A1A]">
              <Plus className="mr-2 h-3.5 w-3.5" /> Adicionar Obra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg rounded-none border border-[#CCCCCC]/20 bg-[#141414] text-white">
            <DialogHeader>
              <DialogTitle className="font-russa text-2xl font-bold text-white">
                Nova Obra Autoral
              </DialogTitle>
              <p className="font-tatuadora text-xs text-[#9E9E9E]">
                Defina o título, o estilo autoral e carregue a foto em alta resolução.
              </p>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {errorMessage && (
                <div className="border border-red-500/30 bg-red-500/10 p-3 font-tatuadora text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Título da Obra */}
              <div className="space-y-2">
                <Label className="font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#9E9E9E]">
                  Título da Obra *
                </Label>
                <Input
                  placeholder="Ex: Orquídea Silvestre em Fine Line"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="rounded-none border-[#CCCCCC]/20 bg-[#1A1A1A] font-tatuadora text-sm text-white placeholder:text-[#666666] focus:border-white"
                />
              </div>

              {/* Combobox Inteligente de Estilo / Taxonomia Dinâmica */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1.5 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#9E9E9E]">
                    <Tag className="h-3 w-3" /> Categoria / Estilo Autoral *
                  </Label>
                  {normalizedPreview && (
                    <span className="font-tatuadora text-[8.5px] uppercase tracking-[0.15em] text-emerald-400">
                      Slug: #{normalizedPreview.slug}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Input
                    list="category-suggestions"
                    placeholder="Selecione ou digite um novo estilo..."
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="rounded-none border-[#CCCCCC]/20 bg-[#1A1A1A] font-tatuadora text-sm text-white placeholder:text-[#666666] focus:border-white"
                  />
                  <datalist id="category-suggestions">
                    {combinedSuggestions.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                {/* Sugestões Rápidas em Pílulas */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {combinedSuggestions.slice(0, 6).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, category: cat }))
                      }
                      className={`font-tatuadora text-[8px] uppercase tracking-[0.12em] px-2 py-1 border transition-colors ${
                        formData.category.toLowerCase() === cat.toLowerCase()
                          ? "border-white bg-white text-black font-semibold"
                          : "border-[#CCCCCC]/20 bg-[#1E1E1E] text-[#9E9E9E] hover:border-white/50 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Descrição Opcional */}
              <div className="space-y-2">
                <Label className="font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#9E9E9E]">
                  Descrição Poética / Técnica (Opcional)
                </Label>
                <textarea
                  rows={2}
                  placeholder="Ex: Tatuagem autoral executada com agulha 03RL, pigmento carbono premium..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full rounded-none border border-[#CCCCCC]/20 bg-[#1A1A1A] p-3 font-tatuadora text-sm text-white placeholder:text-[#666666] outline-none focus:border-white"
                />
              </div>

              {/* Upload via UploadThing v7 */}
              <div className="space-y-2">
                <Label className="font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#9E9E9E]">
                  Fotografia da Obra (UploadThing) *
                </Label>

                {formData.imageUrl ? (
                  <div className="relative aspect-video w-full overflow-hidden border border-[#CCCCCC]/20 bg-[#1E1E1E]">
                    <Image
                      src={formData.imageUrl}
                      alt="Preview da obra"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="rounded-none font-tatuadora text-[9px] uppercase tracking-[0.15em]"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            imageUrl: "",
                            imageKey: "",
                          }))
                        }
                      >
                        Trocar Imagem
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 font-tatuadora text-[8px] uppercase tracking-[0.1em] text-emerald-400">
                      <Check className="h-3 w-3" /> Imagem Carregada
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-[#CCCCCC]/25 bg-[#1F1F1F]/50 p-6 text-center transition-colors hover:bg-[#222222]">
                    <ImagePlus className="mx-auto mb-2 h-6 w-6 text-[#9E9E9E]" />
                    <p className="mb-3 font-tatuadora text-[9px] uppercase tracking-[0.2em] text-[#CCCCCC]">
                      Selecione uma imagem de alta resolução
                    </p>
                    <UploadButton<OurFileRouter, "galleryImage">
                      endpoint="galleryImage"
                      onClientUploadComplete={(files) => {
                        const file = files?.[0];
                        const url = file?.ufsUrl || file?.url;
                        const key = file?.key || "ut_key";
                        if (url) {
                          setFormData((prev) => ({
                            ...prev,
                            imageUrl: url,
                            imageKey: key,
                          }));
                        }
                      }}
                      onUploadError={(error) => {
                        console.error("[Gallery] Upload falhou:", error);
                        setErrorMessage(`Falha no upload: ${error.message}`);
                      }}
                      appearance={{
                        button:
                          "rounded-none border border-white bg-white px-4 py-2 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#1A1A1A] transition-colors hover:bg-[#CCCCCC]",
                        allowedContent:
                          "mt-2 font-tatuadora text-[9px] text-[#808080]",
                      }}
                      content={{ button: "Carregar Fotografia" }}
                    />
                  </div>
                )}
              </div>

              {/* Destaque */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="rounded-none border-white/20 bg-[#1A1A1A] text-white accent-white"
                />
                <Label
                  htmlFor="featured"
                  className="cursor-pointer font-tatuadora text-[10px] uppercase tracking-[0.12em] text-[#B8B8B8] flex items-center gap-1.5"
                >
                  <Sparkles className="h-3 w-3 text-amber-400" /> Marcar como
                  Destaque na Página Inicial
                </Label>
              </div>

              <Button
                onClick={handleCreate}
                disabled={
                  isLoading === "create" ||
                  !formData.imageUrl ||
                  !formData.title ||
                  !formData.category
                }
                className="w-full rounded-none border border-white bg-white font-tatuadora text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A] hover:bg-[#CCCCCC] hover:text-[#1A1A1A]"
              >
                {isLoading === "create" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Publicar Obra no Atelier
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grade de Obras no Painel */}
      {items.length === 0 ? (
        <div className="border border-[#CCCCCC]/15 bg-[#141414] p-12 text-center sm:p-20">
          <ImagePlus className="mx-auto mb-4 h-12 w-12 text-[#666666]" />
          <h3 className="font-russa text-xl text-white">Nenhuma obra catalogada</h3>
          <p className="mt-2 font-tatuadora text-xs text-[#9E9E9E] max-w-md mx-auto">
            O banco de dados está limpo e pronto para o acervo autoral oficial. Clique em &quot;Adicionar Obra&quot; para registrar a primeira peça.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden border border-[#CCCCCC]/15 bg-[#141414] transition-all hover:border-[#CCCCCC]/40"
            >
              <div className="aspect-square relative overflow-hidden bg-black/50">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.featured && (
                  <Badge className="absolute right-2 top-2 rounded-none border border-amber-400/40 bg-black/85 font-tatuadora text-[8px] uppercase tracking-[0.15em] text-amber-300">
                    ⭐ Destaque
                  </Badge>
                )}
              </div>
              <div className="space-y-2 border-t border-[#CCCCCC]/10 p-3.5 bg-[#171717]">
                <p className="truncate font-tatuadora text-xs font-medium text-white">
                  {item.title}
                </p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="rounded-none border-[#CCCCCC]/20 bg-[#1A1A1A] font-tatuadora text-[8px] uppercase tracking-[0.14em] text-[#CCCCCC]"
                  >
                    {item.category}
                  </Badge>
                </div>

                {item.description && (
                  <p className="line-clamp-2 font-tatuadora text-[10px] text-[#808080]">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 font-tatuadora text-[9px] uppercase tracking-[0.12em] text-[#9E9E9E] hover:text-white"
                    onClick={() => handleToggleFeatured(item.id)}
                    disabled={isLoading === `feat-${item.id}`}
                  >
                    {item.featured ? (
                      <>
                        <StarOff className="w-3.5 h-3.5 mr-1 text-amber-400" />
                        Remover
                      </>
                    ) : (
                      <>
                        <Star className="w-3.5 h-3.5 mr-1" />
                        Destacar
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#808080] hover:bg-red-500/10 hover:text-red-400"
                    onClick={() => handleRemove(item.id)}
                    disabled={isLoading === item.id}
                    title="Excluir obra permanentemente"
                  >
                    {isLoading === item.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
