"use client";

import { useState } from "react";
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
    const result = await addGalleryItemAction(formData);
    if (result.success) {
      setIsCreateOpen(false);
      setFormData({
        title: "",
        styleCategory: "",
        imageUrl: "",
        instagramPostUrl: "",
        featured: false,
      });
    }
    setIsLoading(null);
  };

  const handleRemove = async (id: string) => {
    setIsLoading(id);
    await removeGalleryItemAction(id);
    setIsLoading(null);
  };

  const handleToggleFeatured = async (id: string) => {
    setIsLoading(`feat-${id}`);
    await toggleFeaturedAction(id);
    setIsLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* Header + Add Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/50">
          {items.length} trabalho(s) na galeria
        </p>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="border border-white bg-transparent text-white hover:bg-white hover:text-black">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Trabalho
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-white/10 max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">
                Novo Trabalho
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground/70">Título</Label>
                <Input
                  placeholder="Nome do trabalho"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground/70">Categoria</Label>
                <Select
                  value={formData.styleCategory}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, styleCategory: value ?? "" }))
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {galleryCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground/70">URL da Imagem</Label>
                <Input
                  placeholder="https://utfs.io/f/..."
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  className="bg-white/5 border-white/10"
                />
                <p className="text-xs text-foreground/30">
                  Cole a URL da imagem carregada via UploadThing ou Unsplash.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground/70 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> URL do Post Instagram
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
                  className="bg-white/5 border-white/10"
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
                <Label htmlFor="featured" className="text-foreground/70 text-sm cursor-pointer">
                  Marcar como destaque
                </Label>
              </div>

              <Button
                onClick={handleCreate}
                disabled={
                  isLoading === "create" ||
                  !formData.title ||
                  !formData.styleCategory ||
                  !formData.imageUrl ||
                  !formData.instagramPostUrl
                }
                className="w-full border border-white bg-transparent text-white hover:bg-white hover:text-black"
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
        <div className="glass rounded-xl p-16 text-center">
          <ImagePlus className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
          <p className="text-foreground/40 text-sm">
            Nenhum trabalho na galeria ainda.
          </p>
          <p className="text-foreground/30 text-xs mt-1">
            Clique em &quot;Adicionar Trabalho&quot; para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="glass rounded-xl overflow-hidden group border border-white/5"
            >
              <div className="aspect-square relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.featured && (
                  <Badge className="absolute top-2 right-2 bg-white/90 text-background text-[10px]">
                    ⭐ Destaque
                  </Badge>
                )}
              </div>
              <div className="p-3 space-y-2">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <Badge
                  variant="outline"
                  className="text-xs border-white/10 text-foreground/50"
                >
                  {item.styleCategory}
                </Badge>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-foreground/40 hover:text-yellow-400"
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
                      className="h-7 w-7 text-foreground/40 hover:text-white"
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
                    className="h-7 w-7 text-foreground/40 hover:text-destructive"
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
