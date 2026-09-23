import { db } from "@/lib/db";
import { scheduleSlots } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import SlotManagerCalendar from "@/components/admin/SlotManagerCalendar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda",
};

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const slots = await db
    .select({
      id: scheduleSlots.id,
      date: scheduleSlots.date,
      timeStart: scheduleSlots.timeStart,
      timeEnd: scheduleSlots.timeEnd,
      status: scheduleSlots.status,
    })
    .from(scheduleSlots)
    .orderBy(asc(scheduleSlots.date), asc(scheduleSlots.timeStart));

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 font-tatuadora text-[9px] uppercase tracking-[0.3em] text-[#808080]">Atelier · Disponibilidade</p>
        <h1 className="mb-1 font-russa text-4xl font-semibold text-white sm:text-5xl">Calendário &amp; horários</h1>
        <p className="font-tatuadora text-xs font-light tracking-wide text-[#9E9E9E]">
          Gerir horários disponíveis para agendamento.
        </p>
      </div>

      <SlotManagerCalendar slots={slots} />
    </div>
  );
}
