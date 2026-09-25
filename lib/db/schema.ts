import {
  pgTable,
  uuid,
  varchar,
  integer,
  text,
  boolean,
  timestamp,
  date,
  pgEnum,
  index,
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
  name: text("name"),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
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
// O campo slotId é nullable para suportar pedidos de orçamento
// que não têm um horário pré-definido.
export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  slotId: uuid("slot_id")
    .references(() => scheduleSlots.id, { onDelete: "cascade" }),
  clientName: varchar("client_name", { length: 150 }).notNull(),
  clientEmail: varchar("client_email", { length: 255 }).notNull(),
  clientWhatsapp: varchar("client_whatsapp", { length: 30 }).notNull(),
  tattooStyle: varchar("tattoo_style", { length: 100 }),
  bodyLocation: varchar("body_location", { length: 100 }).notNull(),
  approxSizeCm: varchar("approx_size_cm", { length: 50 }),
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
export const galleryItems = pgTable(
  "gallery_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 140 }).notNull(),
    description: text("description"),
    imageUrl: text("image_url").notNull(),
    imageKey: text("image_key").notNull(), // Identificador UploadThing para expurgo
    category: varchar("category", { length: 80 }).notNull(), // Estilo livre: "Fine Line Floral", "Micro-realismo"
    categorySlug: varchar("category_slug", { length: 100 }).notNull(),
    featured: boolean("featured").default(false).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index("idx_gallery_category").on(table.category),
    categorySlugIdx: index("idx_gallery_category_slug").on(table.categorySlug),
    featuredIdx: index("idx_gallery_featured").on(table.featured),
  })
);

// ── Tabelas Auth.js (NextAuth v5 Drizzle Adapter) ────────────
export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
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
