'use server';

import { revalidatePath } from 'next/cache';
import {
  createProvider,
  createProviderKey,
  deleteProvider,
  deleteProviderKey,
  updateProvider,
  updateProviderKeyStatus,
  updateProviderKey,
  getProviderKeys
} from '../services/news-providers.service';

const REVALIDATE_PATH = '/dashboard/news-providers';

export async function getProviderKeysAction(providerId: string) {
  try {
    const keys = await getProviderKeys(providerId);
    return { success: true, keys };
  } catch (error) {
    console.error('Failed to fetch API keys:', error);
    return { success: false, keys: [] };
  }
}

export async function createProviderAction(formData: FormData) {
  const name = formData.get('name') as string;
  const enabled = formData.get('enabled') === 'true';

  try {
    await createProvider({ name, enabled });
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Provider created successfully' };
  } catch (error) {
    console.error('Failed to create provider:', error);
    return { success: false, message: 'Failed to create provider' };
  }
}

export async function updateProviderAction(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const enabled = formData.get('enabled') === 'true';

  try {
    await updateProvider(id, { name, enabled });
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Provider updated successfully' };
  } catch (error) {
    console.error('Failed to update provider:', error);
    return { success: false, message: 'Failed to update provider' };
  }
}

export async function deleteProviderAction(id: string) {
  try {
    await deleteProvider(id);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'Provider deleted successfully' };
  } catch (error) {
    console.error('Failed to delete provider:', error);
    return { success: false, message: 'Failed to delete provider' };
  }
}

// API Keys Actions

export async function createApiKeyAction(
  providerId: string,
  providerName: string,
  formData: FormData
) {
  const api_key = formData.get('api_key') as string;
  const rate_limit = Number(formData.get('rate_limit') || 0);

  try {
    await createProviderKey({
      provider_id: providerId,
      provider_name: providerName,
      api_key,
      rate_limit,
      enabled: true
    });
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'API Key created successfully' };
  } catch (error) {
    console.error('Failed to create API key:', error);
    return { success: false, message: 'Failed to create API key' };
  }
}

export async function deleteApiKeyAction(id: string) {
  try {
    await deleteProviderKey(id);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'API Key deleted successfully' };
  } catch (error) {
    console.error('Failed to delete API key:', error);
    return { success: false, message: 'Failed to delete API key' };
  }
}

export async function toggleApiKeyStatusAction(id: string, enabled: boolean) {
  try {
    await updateProviderKeyStatus(id, enabled);
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'API Key status updated' };
  } catch (error) {
    console.error('Failed to update API key status:', error);
    return { success: false, message: 'Failed to update API key status' };
  }
}

export async function updateApiKeyAction(id: string, formData: FormData) {
  const api_key = formData.get('api_key') as string;
  const provider_name = formData.get('provider_name') as string;
  const rate_limit = Number(formData.get('rate_limit') || 0);
  const enabled = formData.get('enabled') === 'true';
  const usage_count = Number(formData.get('usage_count') || 0);

  const cooldownStr = formData.get('cooldown_until') as string;
  const cooldown_until = cooldownStr ? new Date(cooldownStr) : null;

  try {
    await updateProviderKey(id, {
      api_key,
      provider_name,
      rate_limit,
      enabled,
      usage_count,
      cooldown_until
    });
    revalidatePath(REVALIDATE_PATH);
    return { success: true, message: 'API Key updated successfully' };
  } catch (error) {
    console.error('Failed to update API key:', error);
    return { success: false, message: 'Failed to update API key' };
  }
}
