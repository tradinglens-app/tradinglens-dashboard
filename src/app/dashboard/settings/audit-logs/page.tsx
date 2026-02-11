import PageContainer from '@/components/layout/page-container';

export default function AuditLogsPage() {
  return (
    <PageContainer
      pageTitle='Audit Logs'
      pageDescription='View system audit logs'
    >
      <div className='flex flex-col gap-4'>
        {/* Placeholder for Data Table */}
        <div className='rounded-md border p-4'>
          <p className='text-muted-foreground text-sm'>No logs found.</p>
        </div>
      </div>
    </PageContainer>
  );
}
