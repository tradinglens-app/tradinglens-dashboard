import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationListing } from '@/features/notifications/components/notification-tables';
import { getNotificationsAction } from '@/features/notifications/actions/notification-actions';
import { getNotificationEnumValues } from '@/features/notifications/services/notifications.service';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function NotificationsPage(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('q');
  const type = searchParamsCache.get('type');

  const isRead = searchParamsCache.get('is_read');
  const createdAt = searchParamsCache.get('created_at');

  const from = createdAt?.[0]
    ? new Date(createdAt[0]).toISOString()
    : undefined;
  const to = createdAt?.[1] ? new Date(createdAt[1]).toISOString() : undefined;
  const sort = searchParamsCache.get('sort');

  const [{ data, totalCount }, enumValues] = await Promise.all([
    getNotificationsAction({
      page,
      pageSize: pageLimit,
      search: search || undefined,
      type: type && type.length > 0 ? type : undefined,
      is_read: isRead && isRead.length > 0 ? isRead : undefined,
      created_at_from: from,
      created_at_to: to,
      sort
    }),
    getNotificationEnumValues()
  ]);

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Notifications</h2>
        </div>
        <Card className='flex flex-1 flex-col'>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col'>
            <NotificationListing
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
