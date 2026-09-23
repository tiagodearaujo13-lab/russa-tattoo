ALTER TABLE "users"
  ADD COLUMN "name" text,
  ADD COLUMN "email_verified" timestamp with time zone,
  ADD COLUMN "image" text;
--> statement-breakpoint
ALTER TABLE "accounts"
  ALTER COLUMN "expires_at" TYPE integer
  USING CASE
    WHEN "expires_at" IS NULL THEN NULL
    ELSE EXTRACT(EPOCH FROM "expires_at")::integer
  END;
