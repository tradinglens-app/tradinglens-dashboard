import PageContainer from '@/components/layout/page-container';

export default function ArticleEditPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <PageContainer
      pageTitle='Edit Article'
      pageDescription={`Edit article ${params.id}`}
    >
      {/* Form will go here */}
      <div className='grid gap-4'>
        <p>Form Placeholder</p>
      </div>
    </PageContainer>
  );
}
