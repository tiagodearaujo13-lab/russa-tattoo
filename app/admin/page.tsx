import { db } from "@/lib/db";
import { appointments, scheduleSlots } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import AppointmentsTable from "@/components/admin/AppointmentsTable";
import { CalendarDays, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Buscar agendamentos com dados dos slots
  const allAppointments = await db
    .select({
      id: appointments.id,
      clientName: appointments.clientName,
      clientEmail: appointments.clientEmail,
      clientWhatsapp: appointments.clientWhatsapp,
      tattooStyle: appointments.tattooStyle,
      bodyLocation: appointments.bodyLocation,
      approxSizeCm: appointments.approxSizeCm,
      description: appointments.description,
      referenceImageUrl: appointments.referenceImageUrl,
      status: appointments.status,
      createdAt: appointments.createdAt,
      slotDate: scheduleSlots.date,
      slotTimeStart: scheduleSlots.timeStart,
      slotTimeEnd: scheduleSlots.timeEnd,
    })
    .from(appointments)
    .leftJoin(scheduleSlots, eq(appointments.slotId, scheduleSlots.id))
    .orderBy(desc(appointments.createdAt));

  const formattedAppointments = allAppointments.map((apt) => ({
    id: apt.id,
    clientName: apt.clientName,
    clientEmail: apt.clientEmail,
    clientWhatsapp: apt.clientWhatsapp,
    tattooStyle: apt.tattooStyle,
    bodyLocation: apt.bodyLocation,
    approxSizeCm: apt.approxSizeCm,
    description: apt.description,
    referenceImageUrl: apt.referenceImageUrl,
    status: apt.status,
    createdAt: apt.createdAt.toISOString(),
    slot: apt.slotDate
      ? {
          date: apt.slotDate,
          timeStart: apt.slotTimeStart ?? "",
          timeEnd: apt.slotTimeEnd ?? "",
        }
      : undefined,
  }));

  // Métricas
  const pending = formattedAppointments.filter(
    (a) => a.status === "pending_confirmation"
  ).length;
  const confirmed = formattedAppointments.filter(
    (a) => a.status === "confirmed"
  ).length;
  const total = formattedAppointments.length;

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = formattedAppointments.filter(
    (a) => a.slot?.date === today
  ).length;

  const metrics = [
    {
      icon: AlertTriangle,
      label: "Pendentes",
      value: pending,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      icon: CheckCircle,
      label: "Confirmados",
      value: confirmed,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: CalendarDays,
      label: "Hoje",
      value: todayAppointments,
      color: "text-white",
      bg: "bg-white/10",
    },
    {
      icon: Clock,
      label: "Total",
      value: total,
      color: "text-foreground/60",
      bg: "bg-white/5",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 font-tatuadora text-[9px] uppercase tracking-[0.3em] text-[#808080]">Atelier · Painel administrativo</p>
        <h1 className="mb-1 font-russa text-4xl font-semibold text-white sm:text-5xl">Visão geral</h1>
        <p className="font-tatuadora text-xs font-light tracking-wide text-[#9E9E9E]">
          Visão geral das solicitações de agendamento.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="border border-[#CCCCCC]/15 bg-[#1A1A1A] p-5 transition-colors hover:border-[#CCCCCC]/25"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`border border-white/10 p-2 ${metric.bg}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <span className="font-tatuadora text-[9px] uppercase tracking-[0.25em] text-[#808080]">{metric.label}</span>
            </div>
            <p className="mt-2 font-russa text-4xl font-semibold text-white sm:text-5xl">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Appointments Table */}
      <div>
        <h2 className="mb-4 font-russa text-2xl text-white">Solicitações recentes</h2>
        <AppointmentsTable appointments={formattedAppointments} />
      </div>
    </div>
  );
}
