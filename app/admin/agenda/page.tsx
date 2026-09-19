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
        <h1 className="font-display text-3xl mb-1">Agenda</h1>
        <p className="text-sm text-foreground/50">
          Gerir horários disponíveis para agendamento.
        </p>
      </div>

      <SlotManagerCalendar slots={slots} />
    </div>
  );
}
