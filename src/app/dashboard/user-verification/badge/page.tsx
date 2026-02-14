import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getVerificationRequests } from '@/features/user-verification/badge/services/user.service';
import { UserTable } from '@/features/user-verification/badge/components/user-tables';
import { searchParamsCache } from '@/lib/searchparams';

export default async function BadgeVerificationPage({
  searchParams
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;
  searchParamsCache.parse(params);

  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('userName');
  const username = searchParamsCache.get('username');
  const email = searchParamsCache.get('email');
  const status = searchParamsCache.get('status');
  const createdAt = searchParamsCache.get('created_at');
  const pageLimit = searchParamsCache.get('perPage');
  const sort = searchParamsCache.get('sort');

  const from = createdAt?.[0]
    ? new Date(createdAt[0]).toISOString()
    : undefined;
  const to = createdAt?.[1] ? new Date(createdAt[1]).toISOString() : undefined;

  const filters = {
    page,
    pageSize: pageLimit,
    userName: search || undefined,
    username: username || undefined,
    email: email || undefined,
    status: status ?? undefined,
    from,
    to,
    sort: sort as string
  };

  const { data, totalCount } = await getVerificationRequests(filters);

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Badge Verification
          </h2>
        </div>
        <Card className='flex flex-1 flex-col'>
          <CardHeader>
            <CardTitle>Verification Requests</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col'>
            <UserTable data={data} totalItems={totalCount} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
