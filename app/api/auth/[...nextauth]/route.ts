import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

// O Auth.js, Drizzle e Neon HTTP dependem do runtime Node suportado pela Vercel.
export const runtime = "nodejs";
