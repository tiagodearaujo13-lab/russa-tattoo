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
    available: { label: "Disponível", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" },
    reserved: { label: "Reservado", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" },
    blocked: { label: "Bloqueado", className: "bg-red-500/10 text-red-500 border-red-500/30" },
  };

  return (
    <div className="grid md:grid-cols-[auto_1fr] gap-6">
      {/* Calendar */}
      <div className="glass rounded-xl p-6 space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={pt}
          modifiers={{ hasSlots: datesWithSlots }}
          modifiersClassNames={{
            hasSlots: "!bg-white/20 !text-white font-semibold",
          }}
          className="rounded-xl"
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
          className="w-full border-white/30 text-white hover:bg-white/10"
        >
          {isLoading === "seed" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CalendarPlus className="w-4 h-4 mr-2" />}
          Semear 3 horários de teste
        </Button>
        <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Criar em Lote
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-white/10">
            <DialogHeader>
              <DialogTitle className="font-display">
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
                className="rounded-xl"
              />
              <p className="text-xs text-foreground/40">
                {bulkDates.length} dia(s) selecionado(s)
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground/70">Início</Label>
                  <Input
                    type="time"
                    value={bulkTimes.timeStart}
                    onChange={(e) =>
                      setBulkTimes((prev) => ({ ...prev, timeStart: e.target.value }))
                    }
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/70">Fim</Label>
                  <Input
                    type="time"
                    value={bulkTimes.timeEnd}
                    onChange={(e) =>
                      setBulkTimes((prev) => ({ ...prev, timeEnd: e.target.value }))
                    }
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <Button
                onClick={handleBulkCreate}
                disabled={bulkDates.length === 0 || isLoading === "bulk"}
                className="w-full bg-white hover:bg-zinc-200 hover:text-black text-background"
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
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-sm text-foreground/60">
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
                  className="bg-white hover:bg-zinc-200 hover:text-black text-background"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Novo
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-white/10 max-w-sm">
                <DialogHeader>
                  <DialogTitle className="font-display">
                    Novo Horário —{" "}
                    {format(selectedDate, "dd/MM/yyyy")}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground/70">Início</Label>
                      <Input
                        type="time"
                        value={newSlot.timeStart}
                        onChange={(e) =>
                          setNewSlot((prev) => ({ ...prev, timeStart: e.target.value }))
                        }
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground/70">Fim</Label>
                      <Input
                        type="time"
                        value={newSlot.timeEnd}
                        onChange={(e) =>
                          setNewSlot((prev) => ({ ...prev, timeEnd: e.target.value }))
                        }
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateSlot}
                    disabled={isLoading === "create"}
                    className="w-full bg-white hover:bg-zinc-200 hover:text-black text-background"
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
          <div className="flex flex-col items-center justify-center py-20 text-foreground/30">
            <CalendarPlus className="w-12 h-12 mb-4" />
            <p className="text-sm">Selecione uma data para gerir horários</p>
          </div>
        ) : daySlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-foreground/30">
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
                  className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">
                      {slot.timeStart} — {slot.timeEnd}
                    </span>
                    <Badge variant="outline" className={`text-xs ${config.className}`}>
                      {config.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {slot.status !== "reserved" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-foreground/40 hover:text-yellow-500"
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
                      className="h-8 w-8 text-foreground/40 hover:text-destructive"
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
