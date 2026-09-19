import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Cliente Redis Upstash (REST-based, edge-compatible).
 * Não usa TCP — funciona perfeitamente em Vercel Serverless/Edge.
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Rate Limiter para o endpoint de agendamento.
 * Configuração: Sliding Window — máximo 3 requisições por IP a cada 10 minutos.
 * Protege contra spam/DDoS no formulário de reserva.
 */
export const appointmentRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "10 m"),
  analytics: true,
  prefix: "russa-tattoo:appointment",
});
