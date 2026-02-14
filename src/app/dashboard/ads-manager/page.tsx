import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdsTable } from '@/features/ads-manager/components/ads-table';
import { getAds } from '@/features/ads-manager/services/ads.service';
import { searchParamsCache } from '@/lib/searchparams';

export default async function AdsManagerPage({
  searchParams
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;
  searchParamsCache.parse(params);

  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('search');
  const title_en = searchParamsCache.get('title_en');
  const title_th = searchParamsCache.get('title_th');
  const description_en = searchParamsCache.get('description_en');
  const description_th = searchParamsCache.get('description_th');

  const { data, totalCount } = await getAds({
    page,
    pageSize: pageLimit,
    search: search || undefined,
    title_en: title_en || undefined,
    title_th: title_th || undefined,
    description_en: description_en || undefined,
    description_th: description_th || undefined
  });

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Ads Manager</h2>
        </div>
        <Card className='flex flex-1 flex-col'>
          <CardHeader>
            <CardTitle>Promotion Articles</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col'>
            <AdsTable data={data} totalItems={totalCount} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
