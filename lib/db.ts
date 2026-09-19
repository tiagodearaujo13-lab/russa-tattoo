import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./db/schema";

/**
 * Cliente de conexão com Neon PostgreSQL via HTTP (serverless).
 * Usa o driver @neondatabase/serverless que é compatível com edge runtime.
 *
 * IMPORTANTE: Não usar TCP connections em ambientes serverless.
 * O driver neon-http usa fetch() internamente, ideal para Vercel Edge/Serverless.
 */
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });

export type Database = typeof db;
