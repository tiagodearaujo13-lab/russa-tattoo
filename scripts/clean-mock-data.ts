import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { db } from "../lib/db";
import { galleryItems } from "../lib/db/schema";
import { like, or } from "drizzle-orm";

async function purgeMockData() {
  console.log("Iniciando purga de itens de teste...");

  const deleted = await db
    .delete(galleryItems)
    .where(
      or(
        like(galleryItems.imageUrl, "%unsplash.com%"),
        like(galleryItems.imageUrl, "%via.placeholder.com%"),
        like(galleryItems.title, "%[MOCK]%"),
        like(galleryItems.title, "%Exemplo%")
      )
    )
    .returning({ id: galleryItems.id, title: galleryItems.title });

  console.log(`Sucesso: ${deleted.length} itens de mock foram expurgados.`);
}

purgeMockData().catch(console.error);
