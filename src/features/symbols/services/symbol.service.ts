import { prisma } from '@/lib/prisma';
import { getDistinctValues } from '@/lib/db-enums.service';

export async function getSymbolEnumValues(): Promise<Record<string, string[]>> {
  const types = await getDistinctValues('symbol', 'type', 'main');
  return { type: types };
}

export interface SymbolData {
  id: string;
  symbol: string;
  name: string | null;
  exchange: string | null;
  logo: string | null;
  type: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface GetSymbolsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  name?: string;
  symbol?: string;
  type?: string[];
  exchange?: string;
  createdAt?: number[];
  hasLogo?: string[];
  sort?: string;
}

export async function getSymbols(params: GetSymbolsParams = {}) {
  const {
    page = 1,
    pageSize = 10,
    search,
    name,
    symbol,
    type,
    exchange,
    createdAt,
    hasLogo,
    sort
  } = params;

  const where: any = {};

  if (search) {
    where.OR = [
      { symbol: { contains: search, mode: 'insensitive' } },
      { company_name: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (name) {
    where.company_name = { contains: name, mode: 'insensitive' };
  }

  if (symbol) {
    where.symbol = { contains: symbol, mode: 'insensitive' };
  }

  if (exchange) {
    where.exchange_short_name = { contains: exchange, mode: 'insensitive' };
  }

  if (type && type.length > 0) {
    where.type = { in: type };
  }

  if (createdAt && createdAt.length === 2) {
    where.created_at = {
      gte: new Date(createdAt[0]),
      lte: new Date(createdAt[1])
    };
  }

  if (hasLogo && hasLogo.length > 0) {
    const hasLogoBool = hasLogo.includes('true');
    const noLogoBool = hasLogo.includes('false');

    if (hasLogoBool && !noLogoBool) where.company_logo = { not: null };
    else if (!hasLogoBool && noLogoBool) where.company_logo = null;
  }

  // Sorting logic
  let orderBy: any = { created_at: 'desc' }; // Default sort
  if (sort) {
    try {
      const sortParsed = JSON.parse(sort);
      if (Array.isArray(sortParsed) && sortParsed.length > 0) {
        const { id, desc } = sortParsed[0];
        const direction = desc ? 'desc' : 'asc';

        switch (id) {
          case 'symbol':
          case 'type':
            orderBy = { [id]: direction };
            break;
          case 'name':
            orderBy = { company_name: direction };
            break;
          case 'exchange':
            orderBy = { exchange_short_name: direction };
            break;
          case 'createdAt':
            orderBy = { created_at: direction };
            break;
          default:
            orderBy = { created_at: 'desc' };
        }
      }
    } catch (e) {
      console.error('Failed to parse sort param:', e);
    }
  }

  const [symbols, totalCount] = await Promise.all([
    prisma.symbol.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy
    }),
    prisma.symbol.count({ where })
  ]);

  const data: SymbolData[] = symbols.map((s) => ({
    id: s.id,
    symbol: s.symbol,
    name: s.company_name,
    exchange: s.exchange_short_name,
    logo: s.company_logo,
    type: s.type,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  }));

  return {
    data,
    totalCount,
    pageCount: Math.ceil(totalCount / pageSize)
  };
}

export async function upsertSymbol(data: Partial<SymbolData>) {
  if (!data.symbol) throw new Error('Symbol is required');

  const payload = {
    symbol: data.symbol.toUpperCase(),
    company_name: data.name,
    exchange_short_name: data.exchange?.toUpperCase() || null,
    company_logo: data.logo,
    type: data.type,
    updated_at: new Date()
  };

  if (data.id) {
    return prisma.symbol.update({
      where: { id: data.id },
      data: payload
    });
  } else {
    return prisma.symbol.create({
      data: {
        ...payload,
        created_at: new Date()
      }
    });
  }
}

export async function deleteSymbol(id: string) {
  return prisma.symbol.delete({
    where: { id }
  });
}
