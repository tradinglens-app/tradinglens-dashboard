import PageContainer from '@/components/layout/page-container';

export default function NotificationsCenterPage() {
  return (
    <PageContainer
      pageTitle='Notifications Center'
      pageDescription='View and manage system notifications'
    >
      <div className='flex flex-col gap-4'>
        {/* Placeholder for Data Table */}
        <div className='rounded-md border p-4'>
          <p className='text-muted-foreground text-sm'>No new notifications.</p>
        </div>
      </div>
    </PageContainer>
  );
}
