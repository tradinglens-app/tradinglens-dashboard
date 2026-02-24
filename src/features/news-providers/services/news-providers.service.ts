import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma-client';
import { cache } from 'react';

// Provider Config Types
export type ProviderConfig = Prisma.provider_configsGetPayload<{
  include: { _count: { select: { provider_api_keys: true } } };
}>;

export interface GetProvidersParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateProviderParams {
  name: string;
  enabled?: boolean;
}

export interface UpdateProviderParams {
  name?: string;
  enabled?: boolean;
}

// API Key Types
export type ProviderApiKey = Prisma.provider_api_keysGetPayload<{}>;

export interface CreateApiKeyParams {
  provider_id: string;
  api_key: string;
  provider_name: string; // Required for denormalization in schema
  rate_limit?: number;
  enabled?: boolean;
  cooldown_until?: Date | null;
}

export const getProviders = cache(
  async ({ search, page = 1, limit = 10 }: GetProvidersParams = {}): Promise<{
    providers: ProviderConfig[];
    total: number;
    totalPages: number;
  }> => {
    const where: Prisma.provider_configsWhereInput = search
      ? {
          name: { contains: search, mode: 'insensitive' }
        }
      : {};

    const [providers, total] = await Promise.all([
      prisma.provider_configs.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { created_at: 'desc' },
        include: {
          _count: { select: { provider_api_keys: true } }
        }
      }),
      prisma.provider_configs.count({ where })
    ]);

    return {
      providers,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }
);

export const getProviderById = cache(async (id: string) => {
  return prisma.provider_configs.findUnique({
    where: { id },
    include: {
      provider_api_keys: {
        orderBy: { created_at: 'desc' }
      }
    }
  });
});

export const createProvider = async (data: CreateProviderParams) => {
  return prisma.provider_configs.create({
    data
  });
};

export const updateProvider = async (
  id: string,
  data: UpdateProviderParams
) => {
  return prisma.provider_configs.update({
    where: { id },
    data
  });
};

// Cascade delete is handled by database, but good to be explicit if logic requires
export const deleteProvider = async (id: string) => {
  return prisma.provider_configs.delete({
    where: { id }
  });
};

// --- API Key Management ---

export const getProviderKeys = cache(async (providerId: string) => {
  return prisma.provider_api_keys.findMany({
    where: { provider_id: providerId },
    orderBy: { created_at: 'desc' }
  });
});

export const createProviderKey = async (data: CreateApiKeyParams) => {
  return prisma.provider_api_keys.create({
    data
  });
};

export const deleteProviderKey = async (id: string) => {
  return prisma.provider_api_keys.delete({
    where: { id }
  });
};

export const updateProviderKeyStatus = async (id: string, enabled: boolean) => {
  return prisma.provider_api_keys.update({
    where: { id },
    data: { enabled }
  });
};

export interface UpdateApiKeyParams {
  api_key?: string;
  provider_name?: string;
  rate_limit?: number;
  enabled?: boolean;
  usage_count?: number;
  cooldown_until?: Date | null;
}

export const updateProviderKey = async (
  id: string,
  data: UpdateApiKeyParams
) => {
  return prisma.provider_api_keys.update({
    where: { id },
    data
  });
};
