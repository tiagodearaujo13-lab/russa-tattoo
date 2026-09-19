"use client";

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
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  },
  confirmed: {
    label: "Confirmado",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-red-500/10 text-red-500 border-red-500/30",
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
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-foreground/40 text-sm">
          Nenhuma solicitação de agendamento ainda.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="glass rounded-xl overflow-hidden border border-white/5">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-foreground/40">Cliente</TableHead>
              <TableHead className="text-foreground/40 hidden md:table-cell">Data/Hora</TableHead>
              <TableHead className="text-foreground/40 hidden lg:table-cell">Estilo</TableHead>
              <TableHead className="text-foreground/40">Status</TableHead>
              <TableHead className="text-foreground/40 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((apt) => {
              const config = statusConfig[apt.status];
              return (
                <TableRow
                  key={apt.id}
                  className="border-white/5 hover:bg-white/5"
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{apt.clientName}</p>
                      <p className="text-xs text-foreground/40">
                        {apt.clientEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {apt.slot ? (
                      <div className="text-sm">
                        <p>{format(parseISO(apt.slot.date), "dd/MM/yyyy")}</p>
                        <p className="text-xs text-foreground/40">
                          {apt.slot.timeStart} — {apt.slot.timeEnd}
                        </p>
                      </div>
                    ) : (
                      <span className="text-foreground/30">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm">{apt.tattooStyle}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${config.className}`}>
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-foreground/40 hover:text-foreground"
                        onClick={() => setDetailItem(apt)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-foreground/40 hover:text-white"
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
                            className="h-8 w-8 text-foreground/40 hover:text-emerald-500"
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
                            className="h-8 w-8 text-foreground/40 hover:text-destructive"
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
        <DialogContent className="glass border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Detalhes do Agendamento
            </DialogTitle>
          </DialogHeader>
          {detailItem && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/5">
                <div>
                  <p className="text-foreground/40">Nome</p>
                  <p className="font-medium">{detailItem.clientName}</p>
                </div>
                <div>
                  <p className="text-foreground/40">E-mail</p>
                  <p className="font-medium">{detailItem.clientEmail}</p>
                </div>
                <div>
                  <p className="text-foreground/40">WhatsApp</p>
                  <p className="font-medium">{detailItem.clientWhatsapp}</p>
                </div>
                <div>
                  <p className="text-foreground/40">Status</p>
                  <Badge
                    variant="outline"
                    className={`text-xs ${statusConfig[detailItem.status].className}`}
                  >
                    {statusConfig[detailItem.status].label}
                  </Badge>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-foreground/40">Estilo</p>
                    <p className="font-medium">{detailItem.tattooStyle}</p>
                  </div>
                  <div>
                    <p className="text-foreground/40">Local</p>
                    <p className="font-medium">{detailItem.bodyLocation}</p>
                  </div>
                  <div>
                    <p className="text-foreground/40">Tamanho</p>
                    <p className="font-medium">{detailItem.approxSizeCm}</p>
                  </div>
                </div>
                {detailItem.description && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-foreground/40">Descrição</p>
                    <p className="text-foreground/70 mt-1">
                      {detailItem.description}
                    </p>
                  </div>
                )}
              </div>
              {detailItem.referenceImageUrl && (
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-foreground/40 mb-2">Imagem de Referência</p>
                  <img
                    src={detailItem.referenceImageUrl}
                    alt="Referência"
                    className="w-full max-h-60 object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
