import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Carrega diretamente o .env.local do Next.js
config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});