import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { getProviderById } from '@/features/news-providers/services/news-providers.service';
import { ApiKeyManagementView } from '@/features/news-providers/components/api-key-management-view';
import { notFound } from 'next/navigation';

export default async function ProviderKeysPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const provider = await getProviderById(params.id);

  if (!provider) {
    notFound();
  }

  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'News Providers', link: '/dashboard/news-providers' },
    { title: provider.name, link: `/dashboard/news-providers` },
    {
      title: 'Manage Keys',
      link: `/dashboard/news-providers/${params.id}/keys`
    }
  ];

  return (
    <PageContainer scrollable>
      <div className='space-y-4'>
        <Breadcrumbs items={breadcrumbItems} />
        <ApiKeyManagementView provider={provider as any} />
      </div>
    </PageContainer>
  );
}
