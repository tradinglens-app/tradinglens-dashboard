import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { getNewsAction } from '@/features/news-articles/actions/news-actions';
import { NewsListing } from '@/features/news-articles/components/news-listing';
import { searchParamsCache } from '@/lib/searchparams';

export default async function NewsArticlesPage({
  searchParams
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;
  searchParamsCache.parse(params);

  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('title');
  const symbol = searchParamsCache.get('symbol');
  const publisher = searchParamsCache.get('publisher');
  const createdAt = searchParamsCache.get('createdAt');
  const isActiveParam = searchParamsCache.get('isActive');

  // Handle isActive array
  // If both are present or neither, we want undefined (show all)
  // If only 'true' is present, true
  // If only 'false' is present, false

  let isActive: boolean | undefined = undefined;
  if (isActiveParam && isActiveParam.length === 1) {
    if (isActiveParam.includes('true')) isActive = true;
    if (isActiveParam.includes('false')) isActive = false;
  }

  // Extract date range from createdAt
  const from = createdAt?.[0] ? new Date(createdAt[0]) : undefined;
  const to = createdAt?.[1] ? new Date(createdAt[1]) : undefined;

  const sort = searchParamsCache.get('sort');

  const { data: news, totalCount } = await getNewsAction({
    page,
    pageSize: pageLimit,
    search: search || undefined,
    symbol: symbol || undefined,
    publisher: publisher || undefined,
    from,
    to,
    isActive,
    sort
  });

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>News & Articles</h2>
        </div>
        {totalCount === 0 && (
          <div className='mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
            <p className='text-sm text-yellow-800'>
              <strong>No data found:</strong> The stock_news table appears to be
              empty. Please add some news articles to the database or check your
              database connection.
            </p>
          </div>
        )}
        <Card className='flex flex-1 flex-col'>
          <CardContent className='flex flex-1 flex-col p-6'>
            <NewsListing data={news} totalCount={totalCount} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
