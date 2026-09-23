"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Lock,
  Unlock,
  Loader2,
  CalendarPlus,
  Clock,
} from "lucide-react";
import {
  createSlotAction,
  bulkCreateSlotsAction,
  updateSlotStatusAction,
  deleteSlotAction,
  seedTestSlotsAction,
} from "@/server/actions/slots.actions";
import { format, isSameDay, parseISO } from "date-fns";
import { pt } from "date-fns/locale";

type Slot = {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  status: "available" | "reserved" | "blocked";
};

type SlotManagerCalendarProps = {
  slots: Slot[];
};

export default function SlotManagerCalendar({
  slots,
}: SlotManagerCalendarProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState({ timeStart: "10:00", timeEnd: "13:00" });
  const [bulkDates, setBulkDates] = useState<Date[]>([]);
  const [bulkTimes, setBulkTimes] = useState({ timeStart: "10:00", timeEnd: "13:00" });

  const daySlots = selectedDate
    ? slots.filter((s) => isSameDay(parseISO(s.date), selectedDate))
    : [];

  const datesWithSlots = slots.map((s) => parseISO(s.date));

  const handleCreateSlot = async () => {
    if (!selectedDate) return;
    setIsLoading("create");
    const result = await createSlotAction({
      date: format(selectedDate, "yyyy-MM-dd"),
      timeStart: newSlot.timeStart,
      timeEnd: newSlot.timeEnd,
    });
    setIsLoading(null);
    setIsCreateOpen(false);
    if (result.success) router.refresh();
  };

  const handleBulkCreate = async () => {
    if (bulkDates.length === 0) return;
    setIsLoading("bulk");
    const result = await bulkCreateSlotsAction({
      dates: bulkDates.map((d) => format(d, "yyyy-MM-dd")),
      timeStart: bulkTimes.timeStart,
      timeEnd: bulkTimes.timeEnd,
    });
    setIsLoading(null);
    setIsBulkOpen(false);
    setBulkDates([]);
    if (result.success) router.refresh();
  };

  const handleToggleStatus = async (slotId: string, currentStatus: string) => {
    setIsLoading(slotId);
    const newStatus = currentStatus === "blocked" ? "available" : "blocked";
    const result = await updateSlotStatusAction(slotId, newStatus);
    setIsLoading(null);
    if (result.success) router.refresh();
  };

  const handleDelete = async (slotId: string) => {
    setIsLoading(slotId);
    const result = await deleteSlotAction(slotId);
    setIsLoading(null);
    if (result.success) router.refresh();
  };

  const statusConfig = {
    available: { label: "Disponível", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
    reserved: { label: "Reservado", className: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
    blocked: { label: "Bloqueado", className: "border-zinc-700 bg-zinc-800/40 text-zinc-400" },
  };

  return (
    <div className="grid gap-5 md:grid-cols-[auto_1fr]">
      {/* Calendar */}
      <div className="space-y-4 border border-[#CCCCCC]/15 bg-[#1A1A1A] p-4 sm:p-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={pt}
          modifiers={{ hasSlots: datesWithSlots }}
          modifiersClassNames={{
            hasSlots: "!bg-[#222222] !text-white font-semibold after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:bg-white",
          }}
          className="rounded-none border border-[#CCCCCC]/10 bg-[#1A1A1A] font-tatuadora text-[#DCDCDC] [&_.rdp-day_button]:rounded-none [&_.rdp-day_button]:border [&_.rdp-day_button]:border-[#CCCCCC]/10 [&_.rdp-day_button:hover]:bg-[#222222] [&_.rdp-day_button[data-selected-single=true]]:bg-white [&_.rdp-day_button[data-selected-single=true]]:text-[#1A1A1A]"
        />

        {/* Bulk Create Button */}
        <Button
          variant="outline"
          onClick={async () => {
            setIsLoading("seed");
            const result = await seedTestSlotsAction();
            setIsLoading(null);
            if (result.success) router.refresh();
          }}
          disabled={isLoading === "seed"}
          className="w-full rounded-none border border-white/20 bg-transparent font-tatuadora text-[9px] uppercase tracking-[0.16em] text-[#DCDCDC] hover:border-white hover:bg-white hover:text-[#1A1A1A]"
        >
          {isLoading === "seed" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CalendarPlus className="w-4 h-4 mr-2" />}
          Semear 3 horários de teste
        </Button>
        <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full rounded-none border border-white/20 bg-transparent font-tatuadora text-[9px] uppercase tracking-[0.16em] text-[#DCDCDC] hover:border-white hover:bg-white hover:text-[#1A1A1A]"
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Criar em Lote
            </Button>
          </DialogTrigger>
          <DialogContent className="border border-[#CCCCCC]/15 bg-[#222222] text-white">
            <DialogHeader>
              <DialogTitle className="font-russa text-2xl text-white">
                Criar Horários em Lote
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Calendar
                mode="multiple"
                selected={bulkDates}
                onSelect={(dates) => setBulkDates(dates || [])}
                locale={pt}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-none border border-[#CCCCCC]/10 bg-[#1A1A1A] font-tatuadora text-[#DCDCDC] [&_.rdp-day_button]:rounded-none [&_.rdp-day_button]:border [&_.rdp-day_button]:border-[#CCCCCC]/10 [&_.rdp-day_button:hover]:bg-[#222222] [&_.rdp-day_button[data-selected-single=true]]:bg-white [&_.rdp-day_button[data-selected-single=true]]:text-[#1A1A1A]"
              />
              <p className="font-tatuadora text-[10px] uppercase tracking-[0.16em] text-[#808080]">
                {bulkDates.length} dia(s) selecionado(s)
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#9E9E9E]">Início</Label>
                  <Input
                    type="time"
                    value={bulkTimes.timeStart}
                    onChange={(e) =>
                      setBulkTimes((prev) => ({ ...prev, timeStart: e.target.value }))
                    }
                    className="rounded-none border-[#CCCCCC]/20 bg-[#141414] font-tatuadora text-sm text-white focus:border-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#9E9E9E]">Fim</Label>
                  <Input
                    type="time"
                    value={bulkTimes.timeEnd}
                    onChange={(e) =>
                      setBulkTimes((prev) => ({ ...prev, timeEnd: e.target.value }))
                    }
                    className="rounded-none border-[#CCCCCC]/20 bg-[#141414] font-tatuadora text-sm text-white focus:border-white"
                  />
                </div>
              </div>
              <Button
                onClick={handleBulkCreate}
                disabled={bulkDates.length === 0 || isLoading === "bulk"}
                className="w-full rounded-none bg-white font-tatuadora text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A] hover:bg-[#CCCCCC] hover:text-[#1A1A1A]"
              >
                {isLoading === "bulk" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Criar {bulkDates.length} Horário(s)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Day Slots */}
      <div className="min-h-[330px] border border-[#CCCCCC]/15 bg-[#1A1A1A] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            <span className="font-tatuadora text-[10px] uppercase tracking-[0.15em] text-[#B8B8B8]">
              {selectedDate
                ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: pt })
                : "Selecione uma data"}
            </span>
          </div>

          {selectedDate && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="rounded-none bg-white font-tatuadora text-[9px] uppercase tracking-[0.15em] text-[#1A1A1A] hover:bg-[#CCCCCC] hover:text-[#1A1A1A]"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Novo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm border border-[#CCCCCC]/15 bg-[#222222] text-white">
                <DialogHeader>
                  <DialogTitle className="font-russa text-2xl text-white">
                    Novo Horário —{" "}
                    {format(selectedDate, "dd/MM/yyyy")}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#9E9E9E]">Início</Label>
                      <Input
                        type="time"
                        value={newSlot.timeStart}
                        onChange={(e) =>
                          setNewSlot((prev) => ({ ...prev, timeStart: e.target.value }))
                        }
                        className="rounded-none border-[#CCCCCC]/20 bg-[#141414] font-tatuadora text-sm text-white focus:border-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-tatuadora text-[9px] uppercase tracking-[0.18em] text-[#9E9E9E]">Fim</Label>
                      <Input
                        type="time"
                        value={newSlot.timeEnd}
                        onChange={(e) =>
                          setNewSlot((prev) => ({ ...prev, timeEnd: e.target.value }))
                        }
                        className="rounded-none border-[#CCCCCC]/20 bg-[#141414] font-tatuadora text-sm text-white focus:border-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateSlot}
                    disabled={isLoading === "create"}
                    className="w-full rounded-none bg-white font-tatuadora text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A] hover:bg-[#CCCCCC] hover:text-[#1A1A1A]"
                  >
                    {isLoading === "create" ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Criar Horário
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {!selectedDate ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#707070]">
            <CalendarPlus className="w-12 h-12 mb-4" />
            <p className="text-sm">Selecione uma data para gerir horários</p>
          </div>
        ) : daySlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#707070]">
            <Clock className="w-12 h-12 mb-4" />
            <p className="text-sm">Sem horários para este dia</p>
            <p className="text-xs mt-1">Clique em &quot;Novo&quot; para criar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {daySlots.map((slot) => {
              const config = statusConfig[slot.status];
              return (
                <div
                  key={slot.id}
                  className="flex items-center justify-between border border-[#CCCCCC]/15 bg-[#1F1F1F] p-4 transition-colors hover:border-[#CCCCCC]/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-tatuadora text-xs font-medium text-white">
                      {slot.timeStart} — {slot.timeEnd}
                    </span>
                    <Badge variant="outline" className={`rounded-none px-2 py-0.5 font-tatuadora text-[9px] uppercase tracking-wider ${config.className}`}>
                      {config.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {slot.status !== "reserved" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#808080] hover:bg-amber-500/10 hover:text-amber-300"
                        onClick={() => handleToggleStatus(slot.id, slot.status)}
                        disabled={isLoading === slot.id}
                        title={
                          slot.status === "blocked" ? "Desbloquear" : "Bloquear"
                        }
                      >
                        {isLoading === slot.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : slot.status === "blocked" ? (
                          <Unlock className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#808080] hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => handleDelete(slot.id)}
                      disabled={isLoading === slot.id}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
