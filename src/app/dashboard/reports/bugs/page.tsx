import PageContainer from '@/components/layout/page-container';
import { ReportListing } from '@/features/reports/bugs/components/report-tables';
import { getBugReports } from '@/features/reports/bugs/actions/report-actions';
import { getBugReportEnumValues } from '@/features/reports/bugs/services/report.service';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import { Card, CardContent } from '@/components/ui/card';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function BugReportsPage(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('q');
  const id = searchParamsCache.get('id');
  const topic = searchParamsCache.get('topic');
  const status = searchParamsCache.get('status');
  const createdAt = searchParamsCache.get('created_at');
  const sort = searchParamsCache.get('sort');

  const from = createdAt?.[0]
    ? new Date(createdAt[0]).toISOString()
    : undefined;
  const to = createdAt?.[1] ? new Date(createdAt[1]).toISOString() : undefined;

  const [{ data, totalCount }, enumValues] = await Promise.all([
    getBugReports({
      page,
      pageSize: pageLimit,
      search,
      id,
      topic,
      status: status ? (Array.isArray(status) ? status : [status]) : undefined,
      from,
      to,
      sort
    }),
    getBugReportEnumValues()
  ]);

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Bug Reports</h2>
        </div>
        <Card className='flex flex-1 flex-col'>
          <CardContent className='flex flex-1 flex-col p-6'>
            <ReportListing
              data={data}
              totalCount={totalCount}
              enumValues={enumValues}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
