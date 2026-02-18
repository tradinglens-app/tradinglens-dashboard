import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ProviderDialog } from '@/features/news-providers/components/provider-dialog';
import { ProviderSearch } from '@/features/news-providers/components/provider-search';
import { ProviderTable } from '@/features/news-providers/components/provider-table';
import { getProviders } from '@/features/news-providers/services/news-providers.service';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News Providers',
  description: 'Manage news service providers and API keys.'
};

export default async function NewsProvidersPage(props: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.q || '';
  const page = Number(searchParams?.page) || 1;
  const limit = 10;

  const { providers, total } = await getProviders({
    search,
    page,
    limit
  });

  return (
    <PageContainer
      scrollable={false}
      pageTitle='News Providers'
      pageDescription='Manage news service providers and API keys.'
      pageHeaderAction={<ProviderDialog />}
    >
      <div className='flex flex-1 flex-col space-y-4'>
        <Card className='flex flex-1 flex-col'>
          <CardHeader>
            <CardTitle>Providers</CardTitle>
            <CardDescription>
              Manage various news source providers and their configurations.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex min-h-0 flex-1 flex-col'>
            <div className='mb-4 flex items-center justify-between'>
              <ProviderSearch />
            </div>
            <ProviderTable providers={providers} totalItems={total} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
