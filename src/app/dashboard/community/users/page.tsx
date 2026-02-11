import PageContainer from '@/components/layout/page-container';

export default function UsersPage() {
  return (
    <PageContainer
      pageTitle='Community Users'
      pageDescription='Manage community members'
    >
      <div className='flex flex-col gap-4'>
        {/* Placeholder for Data Table */}
        <div className='rounded-md border p-4'>
          <p className='text-muted-foreground text-sm'>No users found.</p>
        </div>
      </div>
    </PageContainer>
  );
}
