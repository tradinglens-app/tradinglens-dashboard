import { prisma } from '@/lib/prisma';

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
  type?: string;
  exchange?: string;
}

export async function getSymbols(params: GetSymbolsParams = {}) {
  const { page = 1, pageSize = 10, search, type, exchange } = params;

  const where: any = {};

  if (search) {
    where.OR = [
      { symbol: { contains: search, mode: 'insensitive' } },
      { company_name: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (type) {
    where.type = type;
  }

  if (exchange) {
    where.exchange_short_name = exchange;
  }

  const [symbols, totalCount] = await Promise.all([
    prisma.symbol.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { created_at: 'desc' }
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
