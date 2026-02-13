import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCommunityUsers } from '@/features/community/users/services/community-users.service';
import { UsersTable } from '@/features/community/users/components/users-table';
import { searchParamsCache } from '@/lib/searchparams';

export default async function CommunityUsersPage({
  searchParams
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;
  searchParamsCache.parse(params);

  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const name = searchParamsCache.get('userName');
  const username = searchParamsCache.get('username');
  const email = searchParamsCache.get('email');
  const status = searchParamsCache.get('status'); // verification status
  const accountStatus = searchParamsCache.get('accountStatus');
  const dateRange = searchParamsCache.get('date');
  const pageLimit = searchParamsCache.get('perPage');
  const sort = searchParamsCache.get('sort');

  const from = dateRange?.[0]
    ? new Date(dateRange[0]).toISOString()
    : undefined;
  let to = dateRange?.[1] ? new Date(dateRange[1]).toISOString() : undefined;

  // If only one date is selected, assume it's a single day range (start of day to end of day)
  if (!to && from) {
    to = from;
  }

  const filters = {
    page,
    pageSize: pageLimit,
    search,
    userName: name || undefined,
    username: username || undefined,
    email: email || undefined,
    status: status ?? undefined,
    accountStatus: accountStatus ?? undefined,
    from,
    to,
    sort: sort as string
  };

  const { data, totalCount } = await getCommunityUsers(filters);

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Community Users</h2>
        </div>
        <Card className='flex flex-1 flex-col'>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col'>
            <UsersTable data={data} totalItems={totalCount} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
