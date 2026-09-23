import { readFile } from "node:fs/promises";

const envFiles = [".env", ".env.local"];
const fileValues = new Map();

for (const file of envFiles) {
  try {
    const contents = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(
        /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/
      );
      if (!match || match[1] in process.env) continue;

      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      } else {
        value = value.replace(/\s+#.*$/, "");
      }
      fileValues.set(match[1], value.trim());
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

const env = (name) => (process.env[name] ?? fileValues.get(name) ?? "").trim();
const results = [];

function check(name, valid, detail) {
  results.push({ name, valid, detail });
}

const databaseUrl = env("DATABASE_URL");
check(
  "DATABASE_URL",
  /^postgresql:\/\/\S+$/i.test(databaseUrl),
  "use uma URL PostgreSQL do Neon (postgresql://...)"
);

const authSecret = env("AUTH_SECRET") || env("NEXTAUTH_SECRET");
check("AUTH_SECRET", authSecret.length >= 32, "mínimo de 32 caracteres");

for (const name of ["AUTH_URL", "NEXTAUTH_URL"]) {
  const value = env(name);
  let valid = false;
  try {
    const url = new URL(value);
    valid = ["http:", "https:"].includes(url.protocol);
  } catch {
    valid = false;
  }
  check(name, valid, "deve ser uma URL http(s) válida");
}

const adminEmails = env("ADMIN_EMAIL")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
const validEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
check(
  "ADMIN_EMAIL",
  adminEmails.length > 0 && adminEmails.every((email) => validEmailPattern.test(email)),
  "configure um ou mais e-mails válidos separados por vírgula"
);

const resendKey = env("RESEND_API_KEY");
check(
  "RESEND_API_KEY",
  /^re_[A-Za-z0-9_-]+$/.test(resendKey),
  "deve começar com re_"
);
check(
  "EMAIL_FROM",
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env("EMAIL_FROM")),
  "configure um remetente de e-mail válido"
);

check(
  "UPSTASH_REDIS_REST_URL",
  /^https:\/\//i.test(env("UPSTASH_REDIS_REST_URL")),
  "deve ser uma URL HTTPS do Upstash"
);
check(
  "UPSTASH_REDIS_REST_TOKEN",
  Boolean(env("UPSTASH_REDIS_REST_TOKEN")),
  "necessário para autenticar no Upstash"
);
check(
  "UPLOADTHING_TOKEN",
  Boolean(env("UPLOADTHING_TOKEN")),
  "necessário para uploads"
);

let hasErrors = false;
for (const result of results) {
  const status = result.valid ? "OK" : "FALTA/INVÁLIDO";
  console.log(`${status} ${result.name}${result.valid ? "" : ` — ${result.detail}`}`);
  if (!result.valid) hasErrors = true;
}

if (hasErrors) {
  console.error(
    "\nConfigure as variáveis em .env.local (local) e na Vercel (produção). Nenhum valor foi exibido."
  );
  process.exitCode = 1;
} else {
  console.log("\nVariáveis verificadas; nenhum valor sensível foi exibido.");
}
