import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scheduleSlots } from "@/lib/db/schema";
import { gte } from "drizzle-orm";

/**
 * GET /api/schedules/public
 *
 * Endpoint ESTRITAMENTE ANÔNIMO para a agenda pública.
 * REGRA DE OURO: Retorna APENAS id, date, time_start, time_end e status.
 * NUNCA expõe dados de clientes (nome, telefone, e-mail, descrição).
 *
 * Cache: ISR de 60 segundos via revalidate.
 */
export const revalidate = 60;

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const slots = await db
      .select({
        id: scheduleSlots.id,
        date: scheduleSlots.date,
        timeStart: scheduleSlots.timeStart,
        timeEnd: scheduleSlots.timeEnd,
        status: scheduleSlots.status,
      })
      .from(scheduleSlots)
      .where(gte(scheduleSlots.date, today))
      .orderBy(scheduleSlots.date, scheduleSlots.timeStart);

    return NextResponse.json(
      { slots },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("[API] Erro ao buscar slots públicos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
