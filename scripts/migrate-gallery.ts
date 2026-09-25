import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);

  console.log("Migrando tabela gallery_items no Neon...");

  // Adiciona novas colunas caso não existam
  await sql`
    ALTER TABLE gallery_items 
    ADD COLUMN IF NOT EXISTS description text,
    ADD COLUMN IF NOT EXISTS image_key text DEFAULT 'legacy' NOT NULL,
    ADD COLUMN IF NOT EXISTS category varchar(80) DEFAULT 'Fine Line' NOT NULL,
    ADD COLUMN IF NOT EXISTS category_slug varchar(100) DEFAULT 'fine-line' NOT NULL,
    ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0 NOT NULL,
    ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now() NOT NULL;
  `;

  // Copia dados de style_category para category se a coluna antiga existir
  try {
    await sql`
      UPDATE gallery_items 
      SET category = style_category, category_slug = lower(replace(style_category, ' ', '-'))
      WHERE style_category IS NOT NULL AND category = 'Fine Line';
    `;
  } catch {
    // style_category pode já não existir
  }

  // Remove colunas legadas se existirem
  try {
    await sql`ALTER TABLE gallery_items DROP COLUMN IF EXISTS style_category;`;
    await sql`ALTER TABLE gallery_items DROP COLUMN IF EXISTS instagram_post_url;`;
  } catch (e) {
    console.warn("Aviso ao remover colunas legadas:", e);
  }

  // Cria índices se não existirem
  await sql`CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items (category);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_gallery_category_slug ON gallery_items (category_slug);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_gallery_featured ON gallery_items (featured);`;

  console.log("Migração concluída com sucesso!");
}

migrate().catch(console.error);
