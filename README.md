# Russa Tattoo Studio

Plataforma full-stack serverless para estúdio de tatuagem, construída com Next.js, Drizzle ORM, Neon PostgreSQL, Auth.js, Upstash, Resend e UploadThing.

## Estado atual

- Landing page pública dark editorial com hero, sobre, estilos, piercing, agenda ao vivo, galeria, FAQ e contacto.
- Fluxo de solicitação de agendamento com validação Zod, rate limit e notificações por e-mail.
- Painel administrativo protegido por magic link em `/login` e disponível em `/admin`.
- Gestão de agendamentos, slots e galeria.
- API pública de agenda limitada aos campos públicos do horário.
- UploadThing configurado com proteção para administrador.
- Build validado com Next.js 16, TypeScript e ESLint.

## Desenvolvimento

```bash
npm install
npm run dev
```

A aplicação fica disponível em `http://localhost:3000`.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

- `DATABASE_URL` — conexão Neon PostgreSQL.
- `AUTH_SECRET` — segredo do Auth.js.
- `AUTH_URL` ou `NEXTAUTH_URL` — URL pública da aplicação.
- `ADMIN_EMAIL` — e-mails autorizados no painel, separados por vírgula.
- `RESEND_API_KEY` e `EMAIL_FROM` — envio de e-mails.
- `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` — rate limit.
- `UPLOADTHING_TOKEN` — upload de imagens.
- `NEXT_PUBLIC_STUDIO_INSTAGRAM` e `NEXT_PUBLIC_STUDIO_WHATSAPP` — links públicos.

Depois de configurar o banco, gere/aplique as tabelas conforme o ambiente:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Sem a migração aplicada, a agenda e o painel não conseguirão consultar `schedule_slots` e as demais tabelas.

## Verificação

```bash
npx tsc --noEmit
npm run lint
npm run build
```

O lint deve concluir sem erros ou avisos.

## Rotas principais

- `/` — site público.
- `/login` — login administrativo por magic link.
- `/admin` — dashboard.
- `/admin/agenda` — gestão de horários.
- `/admin/galeria` — gestão do portfólio.
- `/api/schedules/public` — agenda pública sanitizada.
- `/api/uploadthing` — endpoint de upload protegido.
