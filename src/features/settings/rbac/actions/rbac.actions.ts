'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

export type MenuPermissions = Record<string, string[]>;

/**
 * Get the current organization's menu permissions from publicMetadata
 */
export async function getMenuPermissionsAction(): Promise<MenuPermissions> {
  const { orgId } = await auth();
  if (!orgId) return {};

  const client = await clerkClient();
  const org = await client.organizations.getOrganization({
    organizationId: orgId
  });
  const metadata = org.publicMetadata as Record<string, unknown>;

  return (metadata?.menuPermissions as MenuPermissions) || {};
}

/**
 * Update menu permissions for a specific role in current organization
 */
export async function updateMenuPermissionsAction(
  roleKey: string,
  menuKeys: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { orgId } = await auth();
    if (!orgId) return { success: false, error: 'No organization selected' };

    const client = await clerkClient();
    const org = await client.organizations.getOrganization({
      organizationId: orgId
    });
    const metadata = org.publicMetadata as Record<string, unknown>;
    const currentPermissions =
      (metadata?.menuPermissions as MenuPermissions) || {};

    const updatedPermissions: MenuPermissions = {
      ...currentPermissions,
      [roleKey]: menuKeys
    };

    await client.organizations.updateOrganization(orgId, {
      publicMetadata: {
        ...metadata,
        menuPermissions: updatedPermissions
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to update menu permissions:', error);
    return { success: false, error: 'Failed to update permissions' };
  }
}

/**
 * Get available roles for the current organization
 * Dynamically fetches roles from Clerk and auto-generates friendly names
 */
export async function getOrgRolesAction(): Promise<
  { key: string; name: string; description: string }[]
> {
  /**
   * Auto-generate friendly name from role key
   * Example: 'org:support_qa' -> 'Support Qa'
   */
  const formatRoleName = (key: string): string => {
    return key
      .replace('org:', '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  try {
    const { orgId } = await auth();

    // Predefined roles from Clerk Dashboard (update this list when roles change)
    const predefinedRoles = [
      'org:admin',
      'org:member',
      'org:moderator',
      'org:support_qa',
      'org:analyst',
      'org:ops_admin'
    ];

    // If no org selected, return predefined roles
    if (!orgId) {
      return predefinedRoles.map((key) => ({
        key,
        name: formatRoleName(key),
        description: `Role: ${formatRoleName(key)}`
      }));
    }

    const client = await clerkClient();

    // Get roles from memberships
    const memberships =
      await client.organizations.getOrganizationMembershipList({
        organizationId: orgId,
        limit: 500
      });

    const discoveredRoles = new Set<string>();
    memberships.data.forEach((m) => {
      if (m.role) discoveredRoles.add(m.role);
    });

    // Combine discovered roles with predefined roles to show ALL roles
    const allRoles = new Set([
      ...Array.from(discoveredRoles),
      ...predefinedRoles
    ]);

    // Return all roles with auto-generated names
    return Array.from(allRoles).map((key) => ({
      key,
      name: formatRoleName(key),
      description: `Role: ${formatRoleName(key)}`
    }));
  } catch (error) {
    console.error('Failed to get org roles:', error);
    // Return predefined roles as fallback
    const predefinedRoles = [
      'org:admin',
      'org:member',
      'org:moderator',
      'org:support_qa',
      'org:analyst',
      'org:ops_admin'
    ];
    return predefinedRoles.map((key) => ({
      key,
      name: formatRoleName(key),
      description: `Role: ${formatRoleName(key)}`
    }));
  }
}
