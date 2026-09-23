"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Eye, MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  confirmAppointmentAction,
  cancelAppointmentAction,
} from "@/server/actions/appointments.actions";
import { format, parseISO } from "date-fns";

type Appointment = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientWhatsapp: string;
  tattooStyle: string;
  bodyLocation: string;
  approxSizeCm: string;
  description: string | null;
  referenceImageUrl: string | null;
  status: "pending_confirmation" | "confirmed" | "cancelled";
  createdAt: string;
  slot?: {
    date: string;
    timeStart: string;
    timeEnd: string;
  };
};

type AppointmentsTableProps = {
  appointments: Appointment[];
};

const statusConfig = {
  pending_confirmation: {
    label: "Pendente",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  confirmed: {
    label: "Confirmado",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  },
  cancelled: {
    label: "Cancelado",
    className: "border-zinc-700 bg-zinc-800/40 text-zinc-400",
  },
};

export default function AppointmentsTable({
  appointments,
}: AppointmentsTableProps) {
  const [detailItem, setDetailItem] = useState<Appointment | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleConfirm = async (id: string) => {
    setLoadingId(id);
    await confirmAppointmentAction(id);
    setLoadingId(null);
  };

  const handleCancel = async (id: string) => {
    setLoadingId(id);
    await cancelAppointmentAction(id);
    setLoadingId(null);
  };

  if (appointments.length === 0) {
    return (
      <div className="border border-[#CCCCCC]/15 bg-[#1A1A1A] p-12 text-center">
        <p className="font-tatuadora text-[10px] uppercase tracking-[0.2em] text-[#808080]">
          Nenhuma solicitação de agendamento ainda.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden border border-[#CCCCCC]/15 bg-[#1A1A1A]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#CCCCCC]/15 bg-[#222222] hover:bg-[#222222]">
              <TableHead className="font-tatuadora text-[9px] font-medium uppercase tracking-[0.25em] text-[#9E9E9E]">Cliente</TableHead>
              <TableHead className="hidden font-tatuadora text-[9px] font-medium uppercase tracking-[0.25em] text-[#9E9E9E] md:table-cell">Data/Hora</TableHead>
              <TableHead className="hidden font-tatuadora text-[9px] font-medium uppercase tracking-[0.25em] text-[#9E9E9E] lg:table-cell">Estilo</TableHead>
              <TableHead className="font-tatuadora text-[9px] font-medium uppercase tracking-[0.25em] text-[#9E9E9E]">Status</TableHead>
              <TableHead className="text-right font-tatuadora text-[9px] font-medium uppercase tracking-[0.25em] text-[#9E9E9E]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((apt) => {
              const config = statusConfig[apt.status];
              return (
                <TableRow
                  key={apt.id}
                  className="border-b border-[#CCCCCC]/10 bg-[#1A1A1A] transition-colors hover:bg-[#222222]"
                >
                  <TableCell>
                    <div>
                      <p className="font-tatuadora text-xs font-medium text-white">{apt.clientName}</p>
                      <p className="mt-1 font-tatuadora text-[10px] text-[#808080]">
                        {apt.clientEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {apt.slot ? (
                      <div className="font-tatuadora text-xs text-[#DCDCDC]">
                        <p>{format(parseISO(apt.slot.date), "dd/MM/yyyy")}</p>
                        <p className="mt-1 text-[10px] text-[#808080]">
                          {apt.slot.timeStart} — {apt.slot.timeEnd}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[#707070]">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="font-tatuadora text-xs text-[#DCDCDC]">{apt.tattooStyle}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-none px-2 py-0.5 font-tatuadora text-[9px] uppercase tracking-wider ${config.className}`}>
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#808080] transition-colors hover:bg-white/10 hover:text-white"
                        onClick={() => setDetailItem(apt)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#808080] transition-colors hover:bg-white/10 hover:text-white"
                        asChild
                      >
                        <a
                          href={`https://wa.me/${apt.clientWhatsapp.replace(/[^0-9+]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </Button>
                      {apt.status === "pending_confirmation" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#808080] transition-colors hover:bg-emerald-500/10 hover:text-emerald-300"
                            onClick={() => handleConfirm(apt.id)}
                            disabled={loadingId === apt.id}
                          >
                            {loadingId === apt.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#808080] transition-colors hover:bg-red-500/10 hover:text-red-300"
                            onClick={() => handleCancel(apt.id)}
                            disabled={loadingId === apt.id}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detailItem} onOpenChange={() => setDetailItem(null)}>
        <DialogContent className="max-w-lg border border-[#CCCCCC]/15 bg-[#222222] text-white">
          <DialogHeader>
            <DialogTitle className="font-russa text-2xl text-white">
              Detalhes do Agendamento
            </DialogTitle>
          </DialogHeader>
          {detailItem && (
            <div className="space-y-3 font-tatuadora text-sm">
              <div className="grid grid-cols-2 gap-3 border border-[#CCCCCC]/10 bg-[#1A1A1A] p-4">
                <div>
                  <p className="mb-1 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#808080]">Nome</p>
                  <p className="font-medium text-[#DCDCDC]">{detailItem.clientName}</p>
                </div>
                <div>
                  <p className="mb-1 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#808080]">E-mail</p>
                  <p className="font-medium text-[#DCDCDC]">{detailItem.clientEmail}</p>
                </div>
                <div>
                  <p className="mb-1 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#808080]">WhatsApp</p>
                  <p className="font-medium text-[#DCDCDC]">{detailItem.clientWhatsapp}</p>
                </div>
                <div>
                  <p className="mb-1 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#808080]">Status</p>
                  <Badge
                    variant="outline"
                    className={`rounded-none px-2 py-0.5 font-tatuadora text-[9px] uppercase tracking-wider ${statusConfig[detailItem.status].className}`}
                  >
                    {statusConfig[detailItem.status].label}
                  </Badge>
                </div>
              </div>
              <div className="border border-[#CCCCCC]/10 bg-[#1A1A1A] p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#808080]">Estilo</p>
                    <p className="font-medium text-[#DCDCDC]">{detailItem.tattooStyle}</p>
                  </div>
                  <div>
                    <p className="mb-1 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#808080]">Local</p>
                    <p className="font-medium text-[#DCDCDC]">{detailItem.bodyLocation}</p>
                  </div>
                  <div>
                    <p className="mb-1 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#808080]">Tamanho</p>
                    <p className="font-medium text-[#DCDCDC]">{detailItem.approxSizeCm}</p>
                  </div>
                </div>
                {detailItem.description && (
                  <div className="mt-3 border-t border-[#CCCCCC]/10 pt-3">
                    <p className="mb-1 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#808080]">Descrição</p>
                    <p className="mt-1 leading-relaxed text-[#B8B8B8]">
                      {detailItem.description}
                    </p>
                  </div>
                )}
              </div>
              {detailItem.referenceImageUrl && (
                <div className="border border-[#CCCCCC]/10 bg-[#1A1A1A] p-4">
                  <p className="mb-2 font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#808080]">Imagem de Referência</p>
                  <div className="relative h-60 w-full">
                    <Image
                      src={detailItem.referenceImageUrl}
                      alt="Referência"
                      fill
                      sizes="(max-width: 768px) 100vw, 480px"
                      className="border border-[#CCCCCC]/10 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
