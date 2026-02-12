# Database Commands Guide

This project uses two databases:
1. **Railway** (Default/Main Database)
2. **Supabase** (Thread Database)

## 1. Railway (Default)
Uses `prisma/schema.prisma` and `.env` (`DATABASE_URL`).

### Pull Schema from DB
 Updates `prisma/schema.prisma` with the latest changes from Railway.
```bash
bunx prisma db pull
```

### Generate Client
 Regenerates the Prisma Client for the default schema.
```bash
bunx prisma generate
```

### Open Prisma Studio
 View and edit data in the Railway database.
```bash
bunx prisma studio
```

---

## 2. Supabase (Thread)
Uses `prisma/schema_thread.prisma` and `.env` (`THREAD_DATABASE_URL`).
Config is loaded from `prisma-thread.config.ts`.

### Pull Schema from DB
Updates `prisma/schema_thread.prisma` with the latest changes from Supabase.
**Note:** We use a custom config file to load the connection URL from the environment variable.
```bash
bunx prisma db pull --schema=prisma/schema_thread.prisma --config=prisma-thread.config.ts
```

### Generate Client
Regenerates the Prisma Client for the thread schema.
```bash
bunx prisma generate --schema=prisma/schema_thread.prisma
```

### Open Prisma Studio
View and edit data in the Supabase database.
```bash
bunx prisma studio --schema=prisma/schema_thread.prisma
```

## Troubleshooting
If you encounter connection errors, check your `.env` or `.env.local` files to ensure `DATABASE_URL` and `THREAD_DATABASE_URL` are correct.
