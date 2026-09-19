"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, RefreshCw } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import BookingModal from "./BookingModal";
import { getWhatsAppUrl } from "@/lib/constants/studio";

type PublicSlot = {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  status: "available" | "reserved" | "blocked";
};

export default function LiveCalendarWidget() {
  const [slots, setSlots] = useState<PublicSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<PublicSlot | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSlots = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/schedules/public", { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao carregar horários");
      const data = await res.json();
      setSlots(data.slots || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("[Calendar] Erro ao buscar slots:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialFetch = window.setTimeout(() => void fetchSlots(), 0);
    const interval = setInterval(fetchSlots, 60000);
    return () => {
      window.clearTimeout(initialFetch);
      clearInterval(interval);
    };
  }, [fetchSlots]);

  // Dias que têm slots disponíveis
  const availableDates = slots
    .filter((s) => s.status === "available")
    .map((s) => parseISO(s.date));

  // Slots do dia selecionado
  const daySlots = selectedDate
    ? slots.filter((s) => isSameDay(parseISO(s.date), selectedDate))
    : [];

  const handleSlotClick = (slot: PublicSlot) => {
    if (slot.status === "available") {
      setSelectedSlot(slot);
      setIsBookingOpen(true);
    }
  };

  const statusConfig = {
    available: {
      label: "Disponível",
      className: "bg-status-available/10 text-status-available border-status-available/30",
      dot: "bg-status-available",
    },
    reserved: {
      label: "Reservado",
      className: "bg-status-reserved/10 text-status-reserved border-status-reserved/30",
      dot: "bg-status-reserved",
    },
    blocked: {
      label: "Indisponível",
      className: "bg-status-blocked/10 text-status-blocked border-status-blocked/30",
      dot: "bg-status-blocked",
    },
  };

  return (
    <section id="agenda" className="py-24 md:py-32 relative">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-white/3 rounded-sm blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-white text-sm font-semibold tracking-widest uppercase">
            Agenda Ao Vivo
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-3 mb-4">
            Escolha o Seu Horário
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            Veja a disponibilidade em tempo real e reserve a sua sessão diretamente.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-[auto_1fr] gap-8 max-w-4xl mx-auto"
        >
          {/* Calendar */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <CalendarDays className="w-4 h-4 text-white" />
                Calendário
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchSlots}
                disabled={isLoading}
                className="text-foreground/40 hover:text-white h-8 px-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={pt}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              modifiers={{
                available: availableDates,
              }}
              modifiersClassNames={{
                available: "!bg-white/20 !text-white font-semibold hover:!bg-white/30",
              }}
              className="rounded-sm"
            />
            {lastUpdated && (
              <p className="text-xs text-foreground/30 mt-3 text-center">
                Atualizado às {format(lastUpdated, "HH:mm")}
              </p>
            )}
            {!isLoading && slots.length === 0 && (
              <div className="mt-5 border-t border-white/5 pt-4 text-center">
                <p className="text-xs leading-relaxed text-foreground/50">
                  Sem vagas abertas para este período na agenda automática. Fale connosco pelo WhatsApp para lista de espera ou encaixes.
                </p>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-sm border border-white/30 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-black"
                >
                  Falar pelo WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Slots List */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6 text-sm text-foreground/60">
              <Clock className="w-4 h-4 text-white" />
              {selectedDate ? (
                <span>
                  Horários de{" "}
                  <strong className="text-foreground">
                    {format(selectedDate, "d 'de' MMMM", { locale: pt })}
                  </strong>
                </span>
              ) : (
                <span>Selecione uma data no calendário</span>
              )}
            </div>

            {!selectedDate ? (
              <div className="flex flex-col items-center justify-center py-16 text-foreground/30">
                <CalendarDays className="w-12 h-12 mb-4" />
                <p className="text-sm">Clique num dia para ver os horários</p>
                <p className="text-xs mt-1">Dias com destaque têm disponibilidade</p>
              </div>
            ) : daySlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-foreground/30">
                <Clock className="w-12 h-12 mb-4" />
                <p className="text-sm">Sem horários para este dia</p>
                <p className="text-xs mt-1">Tente outra data</p>
              </div>
            ) : (
              <div className="space-y-3">
                {daySlots.map((slot) => {
                  const config = statusConfig[slot.status];
                  return (
                    <motion.button
                      key={slot.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleSlotClick(slot)}
                      disabled={slot.status !== "available"}
                      className={`slot-card w-full flex items-center justify-between p-4 rounded-sm border transition-all duration-200 ${
                        slot.status === "available"
                          ? "border-status-available/20 hover:border-status-available/50 hover:bg-status-available/5 cursor-pointer"
                          : "border-white/5 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-sm ${config.dot}`} />
                        <span className="font-semibold text-foreground">
                          {slot.timeStart} — {slot.timeEnd}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${config.className}`}
                      >
                        {config.label}
                      </Badge>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
              {Object.entries(statusConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-1.5 text-xs text-foreground/40">
                  <div className={`w-2 h-2 rounded-sm ${config.dot}`} />
                  {config.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedSlot(null);
        }}
        slot={selectedSlot}
        onSuccess={() => {
          fetchSlots();
          setIsBookingOpen(false);
          setSelectedSlot(null);
        }}
      />
    </section>
  );
}
