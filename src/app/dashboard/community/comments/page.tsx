import PageContainer from '@/components/layout/page-container';

export default function CommentsPage() {
  return (
    <PageContainer
      pageTitle='Comments'
      pageDescription='Moderate community comments'
    >
      <div className='flex flex-col gap-4'>
        {/* Placeholder for Data Table */}
        <div className='rounded-md border p-4'>
          <p className='text-muted-foreground text-sm'>No comments found.</p>
        </div>
      </div>
    </PageContainer>
  );
}
