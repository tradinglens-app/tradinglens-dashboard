import PageContainer from '@/components/layout/page-container';
import { AdsForm } from '@/features/ads-manager/components/ads-form';
import { getAdById } from '@/features/ads-manager/services/ads.service';

export default async function AdEditPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === 'new';
  let ad = null;

  if (!isNew) {
    const adId = parseInt(id);
    if (!isNaN(adId)) {
      ad = await getAdById(adId);
    }
  }

  return (
    <PageContainer scrollable={true}>
      <div className='max-w-4xl space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            {isNew ? 'Create Ad' : 'Edit Ad'}
          </h2>
        </div>
        <AdsForm initialData={ad} />
      </div>
    </PageContainer>
  );
}
