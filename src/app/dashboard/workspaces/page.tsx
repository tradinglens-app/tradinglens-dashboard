'use client';

import PageContainer from '@/components/layout/page-container';
import { OrganizationList, useOrganizationList } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import { workspacesInfoContent } from '@/config/infoconfig';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function WorkspacesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Get user's organization memberships to check if they're an admin
  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true
    }
  });

  // Check if user is admin in any organization
  const isAdmin =
    userMemberships?.data?.some(
      (membership) => membership.role === 'org:admin'
    ) ?? false;

  return (
    <PageContainer
      pageTitle='Workspaces'
      pageDescription='Manage your workspaces and switch between them'
      infoContent={workspacesInfoContent}
    >
      {!isLoaded ? (
        <div className='flex items-center justify-center p-8'>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      ) : !isAdmin ? (
        <Alert>
          <Info className='h-4 w-4' />
          <AlertTitle>Workspace Creation Restricted</AlertTitle>
          <AlertDescription>
            Only administrators can create new workspaces. Please contact your
            administrator if you need to create a new workspace.
          </AlertDescription>
        </Alert>
      ) : (
        <OrganizationList
          appearance={{
            baseTheme: isDark ? dark : undefined,
            elements: {
              organizationListBox: 'space-y-2',
              organizationPreview: 'rounded-lg border p-4 hover:bg-accent',
              organizationPreviewMainIdentifier: 'text-lg font-semibold',
              organizationPreviewSecondaryIdentifier:
                'text-sm text-muted-foreground'
            }
          }}
          afterSelectOrganizationUrl='/dashboard/workspaces/team'
          afterCreateOrganizationUrl='/dashboard/workspaces/team'
        />
      )}
    </PageContainer>
  );
}
