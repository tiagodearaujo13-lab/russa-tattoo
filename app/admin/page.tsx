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
        <h1 className="font-display text-3xl mb-1">Dashboard</h1>
        <p className="text-sm text-foreground/50">
          Visão geral das solicitações de agendamento.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="glass rounded-xl p-5 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${metric.bg}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <span className="text-sm text-foreground/50">{metric.label}</span>
            </div>
            <p className="font-display text-3xl">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Appointments Table */}
      <div>
        <h2 className="font-display text-xl mb-4">Solicitações Recentes</h2>
        <AppointmentsTable appointments={formattedAppointments} />
      </div>
    </div>
  );
}
