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
// Use um URL sintaticamente válido durante o build quando a variável de
// runtime não estiver disponível. Consultas ainda dependem de DATABASE_URL real.
const configuredDatabaseUrl = process.env.DATABASE_URL?.trim();
const databaseUrl =
  configuredDatabaseUrl && /^postgresql:\/\//i.test(configuredDatabaseUrl)
    ? configuredDatabaseUrl
    : "postgresql://build:build@127.0.0.1:5432/build";

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });

export type Database = typeof db;
