import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────────────────
export const slotStatusEnum = pgEnum("slot_status", [
  "available",
  "reserved",
  "blocked",
]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending_confirmation",
  "confirmed",
  "cancelled",
]);

// ── Tabela: users ────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  role: varchar("role", { length: 50 }).default("admin").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ── Tabela: schedule_slots ───────────────────────────────────
export const scheduleSlots = pgTable("schedule_slots", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: date("date").notNull(),
  timeStart: varchar("time_start", { length: 5 }).notNull(),
  timeEnd: varchar("time_end", { length: 5 }).notNull(),
  status: slotStatusEnum("status").default("available").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ── Tabela: appointments ─────────────────────────────────────
export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  slotId: uuid("slot_id")
    .references(() => scheduleSlots.id, { onDelete: "cascade" })
    .notNull(),
  clientName: varchar("client_name", { length: 150 }).notNull(),
  clientEmail: varchar("client_email", { length: 255 }).notNull(),
  clientWhatsapp: varchar("client_whatsapp", { length: 30 }).notNull(),
  tattooStyle: varchar("tattoo_style", { length: 100 }).notNull(),
  bodyLocation: varchar("body_location", { length: 100 }).notNull(),
  approxSizeCm: varchar("approx_size_cm", { length: 50 }).notNull(),
  description: text("description"),
  referenceImageUrl: text("reference_image_url"),
  status: appointmentStatusEnum("status")
    .default("pending_confirmation")
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ── Tabela: gallery_items ────────────────────────────────────
export const galleryItems = pgTable("gallery_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  styleCategory: varchar("style_category", { length: 100 }).notNull(),
  imageUrl: text("image_url").notNull(),
  instagramPostUrl: text("instagram_post_url").notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ── Tabelas Auth.js (NextAuth v5 Drizzle Adapter) ────────────
export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  tokenType: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  idToken: text("id_token"),
  sessionState: varchar("session_state", { length: 255 }),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).unique().notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

// ── Tipos inferidos ──────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ScheduleSlot = typeof scheduleSlots.$inferSelect;
export type NewScheduleSlot = typeof scheduleSlots.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewGalleryItem = typeof galleryItems.$inferInsert;
