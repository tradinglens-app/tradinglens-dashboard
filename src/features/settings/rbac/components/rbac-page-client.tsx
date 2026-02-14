'use client';

import { useState, useCallback, useTransition } from 'react';
import { RoleSidebar } from './role-sidebar';
import { MenuPermissionList } from './menu-permission-list';
import {
  updateMenuPermissionsAction,
  type MenuPermissions
} from '../actions/rbac.actions';
import { Button } from '@/components/ui/button';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Role {
  key: string;
  name: string;
  description: string;
}

interface RBACPageClientProps {
  initialRoles: Role[];
  initialPermissions: MenuPermissions;
}

export function RBACPageClient({
  initialRoles,
  initialPermissions
}: RBACPageClientProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(
    initialRoles[0]?.key || null
  );
  const [permissions, setPermissions] =
    useState<MenuPermissions>(initialPermissions);
  const [isPending, startTransition] = useTransition();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSelectRole = useCallback((roleKey: string) => {
    setSelectedRole(roleKey);
  }, []);

  const handleToggleMenu = useCallback(
    (menuKey: string, enabled: boolean) => {
      if (!selectedRole) return;

      setPermissions((prev) => {
        const currentMenus = prev[selectedRole] || [];
        const updatedMenus = enabled
          ? [...currentMenus, menuKey]
          : currentMenus.filter((k) => k !== menuKey);

        return {
          ...prev,
          [selectedRole]: updatedMenus
        };
      });
      setHasUnsavedChanges(true);
    },
    [selectedRole]
  );

  const handleSave = useCallback(() => {
    if (!selectedRole) return;

    startTransition(async () => {
      const result = await updateMenuPermissionsAction(
        selectedRole,
        permissions[selectedRole] || []
      );

      if (result.success) {
        toast.success('Permissions saved', {
          description: `Menu permissions for ${selectedRole} have been updated.`
        });
        setHasUnsavedChanges(false);
      } else {
        toast.error('Failed to save', {
          description: result.error || 'An unexpected error occurred.'
        });
      }
    });
  }, [selectedRole, permissions]);

  // Count permissions per role
  const permissionCounts: Record<string, number> = {};
  for (const role of initialRoles) {
    permissionCounts[role.key] = (permissions[role.key] || []).length;
  }

  const selectedMenuKeys = selectedRole ? permissions[selectedRole] || [] : [];

  const selectedRoleData = initialRoles.find((r) => r.key === selectedRole);

  return (
    <div className='flex gap-6'>
      {/* Sidebar */}
      <RoleSidebar
        roles={initialRoles}
        selectedRole={selectedRole}
        onSelectRole={handleSelectRole}
        permissionCounts={permissionCounts}
      />

      {/* Content */}
      <div className='flex flex-1 flex-col gap-4'>
        {selectedRole ? (
          <>
            {/* Header */}
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold'>
                  {selectedRoleData?.name || selectedRole}
                </h3>
                <p className='text-muted-foreground text-sm'>
                  Configure which menu items this role can access
                </p>
              </div>
              <Button
                onClick={handleSave}
                disabled={isPending || !hasUnsavedChanges}
                size='sm'
                className='gap-2'
              >
                {isPending ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : hasUnsavedChanges ? (
                  <Save className='h-4 w-4' />
                ) : (
                  <CheckCircle2 className='h-4 w-4' />
                )}
                {isPending
                  ? 'Saving...'
                  : hasUnsavedChanges
                    ? 'Save Changes'
                    : 'Saved'}
              </Button>
            </div>

            {/* Permission List */}
            <div className='rounded-lg border p-4'>
              <MenuPermissionList
                selectedMenuKeys={selectedMenuKeys}
                onToggleMenu={handleToggleMenu}
                disabled={isPending}
              />
            </div>
          </>
        ) : (
          <div className='text-muted-foreground flex flex-1 items-center justify-center'>
            <p>Select a role to configure its menu permissions</p>
          </div>
        )}
      </div>
    </div>
  );
}
