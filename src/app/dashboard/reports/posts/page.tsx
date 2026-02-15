import PageContainer from '@/components/layout/page-container';
import { PostReportListing } from '@/features/reports/posts/components/post-report-table';
import { getPostReports } from '@/features/reports/posts/services/post-report.service';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { Card, CardContent } from '@/components/ui/card';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function PostReportsPage(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('perPage');
  const id = searchParamsCache.get('id');
  const postTitle = searchParamsCache.get('postTitle');
  const createdAt = searchParamsCache.get('created_at');
  const sort = searchParamsCache.get('sort');

  const from = createdAt?.[0]
    ? new Date(createdAt[0]).toISOString()
    : undefined;
  const to = createdAt?.[1] ? new Date(createdAt[1]).toISOString() : undefined;

  const { data, totalCount } = await getPostReports({
    page,
    pageSize: pageLimit,
    id,
    postTitle,
    from,
    to,
    sort
  });

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Post Reports</h2>
        </div>
        <Card className='flex flex-1 flex-col'>
          <CardContent className='flex flex-1 flex-col p-6'>
            <PostReportListing data={data} totalCount={totalCount} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
