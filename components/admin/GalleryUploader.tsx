"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Camera,
  Loader2,
  ImagePlus,
  ExternalLink,
} from "lucide-react";
import { galleryCategories } from "@/lib/validations/gallery.schema";
import {
  addGalleryItemAction,
  removeGalleryItemAction,
  toggleFeaturedAction,
} from "@/server/actions/gallery.actions";
import { STUDIO_CONFIG } from "@/lib/constants/studio";

type GalleryItem = {
  id: string;
  title: string;
  styleCategory: string;
  imageUrl: string;
  instagramPostUrl: string;
  featured: boolean;
};

type GalleryUploaderProps = {
  items: GalleryItem[];
};

export default function GalleryUploader({ items }: GalleryUploaderProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    styleCategory: "",
    imageUrl: "",
    instagramPostUrl: "",
    featured: false,
  });

  const handleCreate = async () => {
    setIsLoading("create");
    const result = await addGalleryItemAction({
      ...formData,
      title: formData.title.trim() || "Trabalho Russa Tattoo",
      styleCategory: formData.styleCategory || "Outro",
      instagramPostUrl: formData.instagramPostUrl.trim() || STUDIO_CONFIG.instagram,
    });
    if (result.success) {
      setIsCreateOpen(false);
      setFormData({
        title: "",
        styleCategory: "",
        imageUrl: "",
        instagramPostUrl: "",
        featured: false,
      });
      router.refresh();
    }
    setIsLoading(null);
  };

  const handleRemove = async (id: string) => {
    setIsLoading(id);
    const result = await removeGalleryItemAction(id);
    setIsLoading(null);
    if (result.success) router.refresh();
  };

  const handleToggleFeatured = async (id: string) => {
    setIsLoading(`feat-${id}`);
    const result = await toggleFeaturedAction(id);
    setIsLoading(null);
    if (result.success) router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex items-center justify-between">
        <p className="font-tatuadora text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]">
          {items.length} trabalho(s) na galeria
        </p>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-none border border-white bg-white px-4 font-tatuadora text-[9px] uppercase tracking-[0.16em] text-[#1A1A1A] hover:bg-[#CCCCCC] hover:text-[#1A1A1A]">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Trabalho
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md border border-[#CCCCCC]/15 bg-[#222222] text-white">
            <DialogHeader>
              <DialogTitle className="font-russa text-2xl text-white">
                Novo Trabalho
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#9E9E9E]">Título (opcional)</Label>
                <Input
                  placeholder="Nome do trabalho"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="rounded-none border-[#CCCCCC]/20 bg-[#141414] font-tatuadora text-sm text-white placeholder:text-[#707070] focus:border-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#9E9E9E]">Categoria (opcional)</Label>
                <Select
                  value={formData.styleCategory}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, styleCategory: value ?? "" }))
                  }
                >
                  <SelectTrigger className="rounded-none border-[#CCCCCC]/20 bg-[#141414] font-tatuadora text-sm text-white placeholder:text-[#707070] focus:border-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="border-[#CCCCCC]/15 bg-[#222222] font-tatuadora text-white">
                    {galleryCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#9E9E9E]">URL da Imagem</Label>
                <Input
                  placeholder="https://utfs.io/f/..."
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  className="rounded-none border-[#CCCCCC]/20 bg-[#141414] font-tatuadora text-sm text-white placeholder:text-[#707070] focus:border-white"
                />
                <p className="font-tatuadora text-[9px] leading-relaxed text-[#808080]">
                  Envie pela área segura ou cole uma URL externa.
                </p>
                <div className="border border-dashed border-[#CCCCCC]/25 bg-[#1F1F1F]/50 p-6 text-center transition-colors hover:bg-[#222222]">
                  <ImagePlus className="mx-auto mb-2 h-5 w-5 text-[#9E9E9E]" />
                  <p className="mb-3 font-tatuadora text-[9px] uppercase tracking-[0.2em] text-[#CCCCCC]">
                    Selecione uma imagem para o portfólio
                  </p>
                <UploadButton<OurFileRouter, "galleryImage">
                  endpoint="galleryImage"
                  onClientUploadComplete={(files) => {
                    const url = files?.[0]?.ufsUrl || files?.[0]?.url;
                    if (url) setFormData((prev) => ({ ...prev, imageUrl: url }));
                  }}
                  onUploadError={(error) => console.error("[Gallery] Upload falhou:", error)}
                  appearance={{ button: "rounded-none border border-white bg-white px-4 py-2 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#1A1A1A] transition-colors hover:bg-[#CCCCCC]", allowedContent: "mt-2 font-tatuadora text-[9px] text-[#808080]" }}
                  content={{ button: "Enviar foto" }}
                />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#9E9E9E]">
                  <Camera className="w-3.5 h-3.5" /> URL do Post Instagram (opcional)
                </Label>
                <Input
                  placeholder="https://instagram.com/p/..."
                  value={formData.instagramPostUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instagramPostUrl: e.target.value,
                    }))
                  }
                  className="rounded-none border-[#CCCCCC]/20 bg-[#141414] font-tatuadora text-sm text-white placeholder:text-[#707070] focus:border-white"
                />
              </div>

              <div className="flex items-center gap-2">
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
                  className="rounded border-white/10"
                />
                <Label htmlFor="featured" className="cursor-pointer font-tatuadora text-[10px] uppercase tracking-[0.12em] text-[#B8B8B8]">
                  Marcar como destaque
                </Label>
              </div>

              <Button
                onClick={handleCreate}
                disabled={
                  isLoading === "create" ||
                  !formData.imageUrl
                }
                className="w-full rounded-none border border-white bg-white font-tatuadora text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A] hover:bg-[#CCCCCC] hover:text-[#1A1A1A]"
              >
                {isLoading === "create" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ImagePlus className="w-4 h-4 mr-2" />
                )}
                Adicionar à Galeria
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Grid */}
      {items.length === 0 ? (
        <div className="border border-[#CCCCCC]/15 bg-[#1A1A1A] p-12 text-center sm:p-16">
          <ImagePlus className="mx-auto mb-4 h-10 w-10 text-[#707070]" />
          <p className="font-tatuadora text-[10px] uppercase tracking-[0.2em] text-[#9E9E9E]">
            Nenhum trabalho na galeria ainda.
          </p>
          <p className="mt-2 font-tatuadora text-[9px] text-[#707070]">
            Clique em &quot;Adicionar Trabalho&quot; para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden border border-[#CCCCCC]/15 bg-[#1A1A1A] transition-colors hover:border-[#CCCCCC]/30"
            >
              <div className="aspect-square relative">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
                {item.featured && (
                  <Badge className="absolute right-2 top-2 rounded-none border border-white/20 bg-[#1A1A1A]/90 font-tatuadora text-[8px] uppercase tracking-[0.15em] text-white">
                    ⭐ Destaque
                  </Badge>
                )}
              </div>
              <div className="space-y-2 border-t border-[#CCCCCC]/10 p-3">
                <p className="truncate font-tatuadora text-xs font-medium text-white">{item.title}</p>
                <Badge
                  variant="outline"
                  className="rounded-none border-[#CCCCCC]/15 font-tatuadora text-[8px] uppercase tracking-[0.14em] text-[#9E9E9E]"
                >
                  {item.styleCategory}
                </Badge>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-[#808080] hover:bg-amber-500/10 hover:text-amber-300"
                      onClick={() => handleToggleFeatured(item.id)}
                      disabled={isLoading === `feat-${item.id}`}
                      title={item.featured ? "Remover destaque" : "Destacar"}
                    >
                      {item.featured ? (
                        <StarOff className="w-3.5 h-3.5" />
                      ) : (
                        <Star className="w-3.5 h-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-[#808080] hover:bg-white/10 hover:text-white"
                      asChild
                    >
                      <a
                        href={item.instagramPostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-[#808080] hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => handleRemove(item.id)}
                    disabled={isLoading === item.id}
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
