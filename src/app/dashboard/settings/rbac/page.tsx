import PageContainer from '@/components/layout/page-container';
import { RBACPageClient } from '@/features/settings/rbac/components/rbac-page-client';
import {
  getOrgRolesAction,
  getMenuPermissionsAction
} from '@/features/settings/rbac/actions/rbac.actions';

export const dynamic = 'force-dynamic';

export default async function RBACPage() {
  const [roles, permissions] = await Promise.all([
    getOrgRolesAction(),
    getMenuPermissionsAction()
  ]);

  return (
    <PageContainer
      pageTitle='RBAC Settings'
      pageDescription='Manage Role-Based Access Control — configure which menus each role can access'
    >
      <RBACPageClient initialRoles={roles} initialPermissions={permissions} />
    </PageContainer>
  );
}
