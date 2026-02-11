import PageContainer from '@/components/layout/page-container';

export default function AdsEditPage({ params }: { params: { id: string } }) {
  return (
    <PageContainer pageTitle='Edit Ad' pageDescription={`Edit ad ${params.id}`}>
      {/* Form will go here */}
      <div className='grid gap-4'>
        <p>Form Placeholder</p>
      </div>
    </PageContainer>
  );
}
