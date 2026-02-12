'use client';

/**
 * Fully client-side hook for filtering navigation items based on RBAC
 *
 * This hook uses Clerk's client-side hooks to check permissions, roles, and organization
 * without any server calls. This is perfect for navigation visibility (UX only).
 *
 * Performance:
 * - All checks are synchronous (no server calls)
 * - Instant filtering
 * - No loading states
 * - No UI flashing
 *
 * Note: For actual security (API routes, server actions), always use server-side checks.
 * This is only for UI visibility.
 */

import { useMemo } from 'react';
import { useOrganization, useUser } from '@clerk/nextjs';
import type { NavItem } from '@/types';

/**
 * Hook to filter navigation items based on RBAC (fully client-side)
 *
 * @param items - Array of navigation items to filter
 * @returns Filtered items
 */
export function useFilteredNavItems(items: NavItem[]) {
  const { organization, membership } = useOrganization();
  const { user } = useUser();

  // Memoize context and permissions
  const accessContext = useMemo(() => {
    const permissions = membership?.permissions || [];
    const role = membership?.role;

    // Read menu permissions from organization metadata
    const orgMetadata = organization?.publicMetadata as
      | Record<string, unknown>
      | undefined;
    const menuPermissions = (orgMetadata?.menuPermissions || {}) as Record<
      string,
      string[]
    >;
    const roleMenuKeys = role ? menuPermissions[role] : undefined;

    return {
      organization: organization ?? undefined,
      user: user ?? undefined,
      permissions: permissions as string[],
      role: role ?? undefined,
      hasOrg: !!organization,
      // If roleMenuKeys is undefined, no restrictions (allow all)
      // If roleMenuKeys is defined (even empty []), only allow listed menus
      roleMenuKeys
    };
  }, [
    organization?.id,
    organization?.publicMetadata,
    user?.id,
    membership?.permissions,
    membership?.role
  ]);

  // Filter items synchronously (all client-side)
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Check menu permissions from org metadata
        if (accessContext.roleMenuKeys !== undefined) {
          // For parent items with children (groups), keep if any child is allowed
          if (
            item.items &&
            item.items.length > 0 &&
            (!item.url || item.url === '#')
          ) {
            const hasAllowedChild = item.items.some(
              (child) =>
                child.url && accessContext.roleMenuKeys!.includes(child.url)
            );
            if (!hasAllowedChild) return false;
          } else if (item.url && item.url !== '#') {
            if (!accessContext.roleMenuKeys.includes(item.url)) return false;
          }
        }

        // No access restrictions
        if (!item.access) {
          return true;
        }

        // Check requireOrg
        if (item.access.requireOrg && !accessContext.hasOrg) {
          return false;
        }

        // Check permission
        if (item.access.permission) {
          if (!accessContext.hasOrg) {
            return false;
          }
          if (!accessContext.permissions.includes(item.access.permission)) {
            return false;
          }
        }

        // Check role
        if (item.access.role) {
          if (!accessContext.hasOrg) {
            return false;
          }
          if (accessContext.role !== item.access.role) {
            return false;
          }
        }

        // Note: Plans and features require server-side checks with Clerk's has() function
        if (item.access.plan || item.access.feature) {
          console.warn(
            `Plan/feature checks for navigation items require server-side verification. ` +
              `Item "${item.title}" will be shown, but page-level protection should be implemented.`
          );
        }

        return true;
      })
      .map((item) => {
        // Recursively filter child items
        if (item.items && item.items.length > 0) {
          const filteredChildren = item.items.filter((childItem) => {
            // Check menu permissions from org metadata
            if (accessContext.roleMenuKeys !== undefined) {
              if (childItem.url && childItem.url !== '#') {
                if (!accessContext.roleMenuKeys.includes(childItem.url))
                  return false;
              }
            }

            // No access restrictions
            if (!childItem.access) {
              return true;
            }

            // Check requireOrg
            if (childItem.access.requireOrg && !accessContext.hasOrg) {
              return false;
            }

            // Check permission
            if (childItem.access.permission) {
              if (!accessContext.hasOrg) {
                return false;
              }
              if (
                !accessContext.permissions.includes(childItem.access.permission)
              ) {
                return false;
              }
            }

            // Check role
            if (childItem.access.role) {
              if (!accessContext.hasOrg) {
                return false;
              }
              if (accessContext.role !== childItem.access.role) {
                return false;
              }
            }

            // Plan/feature checks
            if (childItem.access.plan || childItem.access.feature) {
              console.warn(
                `Plan/feature checks for navigation items require server-side verification. ` +
                  `Item "${childItem.title}" will be shown, but page-level protection should be implemented.`
              );
            }

            return true;
          });

          return {
            ...item,
            items: filteredChildren
          };
        }

        return item;
      });
  }, [items, accessContext]);

  return filteredItems;
}
