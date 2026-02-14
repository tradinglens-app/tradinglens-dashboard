import { prisma } from '@/lib/prisma';
import { prismaThread } from '@/lib/prisma-thread';
import { Prisma } from '@/generated/prisma-client';

// ─── Cache ───────────────────────────────────────────────────────────────────
const cache = new Map<
  string,
  { data: Record<string, string[]>; time: number }
>();
const CACHE_TTL = 60 * 1000; // 1 minute

function getCached(key: string): Record<string, string[]> | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.time < CACHE_TTL) return entry.data;
  return null;
}

function setCache(key: string, data: Record<string, string[]>) {
  cache.set(key, { data, time: Date.now() });
}

// ─── Label helper (re-exported from client-safe utils) ───────────────────────
export { toLabel, toOptions } from './db-enums.utils';

// ─── Check Constraints (main DB) ─────────────────────────────────────────────
export async function getCheckConstraintValues(
  tableName: string
): Promise<Record<string, string[]>> {
  const cacheKey = `check:${tableName}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const constraints: { conname: string; condef: string }[] =
    await prisma.$queryRaw(
      Prisma.sql`
        SELECT conname, pg_get_constraintdef(oid) as condef
        FROM pg_constraint
        WHERE conrelid = ${tableName}::regclass
        AND contype = 'c'
      `
    );

  const result: Record<string, string[]> = {};

  for (const row of constraints) {
    // Extract field name: "tablename_fieldname_check" -> "fieldname"
    const nameMatch = row.conname.match(
      new RegExp(`^${tableName}_(.+)_check$`)
    );
    if (!nameMatch) continue;

    const field = nameMatch[1];

    // Extract values from: CHECK ((col = ANY (ARRAY['val1'::text, 'val2'::text])))
    const valuesMatch = row.condef.match(/ARRAY\[([^\]]+)\]/);
    if (!valuesMatch) continue;

    const values = valuesMatch[1]
      .split(',')
      .map((v: string) => v.trim().replace(/^'|'::text$/g, ''))
      .filter(Boolean);

    result[field] = values;
  }

  setCache(cacheKey, result);
  return result;
}

// ─── PG Enum Values (any DB) ─────────────────────────────────────────────────
export async function getEnumValues(
  enumName: string,
  db: 'main' | 'thread' = 'main'
): Promise<string[]> {
  const cacheKey = `enum:${db}:${enumName}`;
  const cached = getCached(cacheKey);
  if (cached) return cached[enumName] || [];

  const client = db === 'thread' ? prismaThread : prisma;

  const rows: { enumlabel: string }[] = await client.$queryRawUnsafe(
    `SELECT e.enumlabel
     FROM pg_enum e
     JOIN pg_type t ON e.enumtypid = t.oid
     WHERE t.typname = $1
     ORDER BY e.enumsortorder`,
    enumName
  );

  const values = rows.map((r) => r.enumlabel);
  setCache(cacheKey, { [enumName]: values });
  return values;
}

// ─── Distinct Values (fallback) ──────────────────────────────────────────────
export async function getDistinctValues(
  tableName: string,
  column: string,
  db: 'main' | 'thread' = 'main'
): Promise<string[]> {
  const cacheKey = `distinct:${db}:${tableName}:${column}`;
  const cached = getCached(cacheKey);
  if (cached) return cached[column] || [];

  const client = db === 'thread' ? prismaThread : prisma;

  const rows: Record<string, string>[] = await client.$queryRawUnsafe(
    `SELECT DISTINCT "${column}" as val FROM "${tableName}" WHERE "${column}" IS NOT NULL ORDER BY val`
  );

  const values = rows.map((r) => r.val).filter(Boolean);
  setCache(cacheKey, { [column]: values });
  return values;
}
