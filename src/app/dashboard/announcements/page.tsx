import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnnouncementsTable } from '@/features/announcements/components/announcements-table';
import {
  getAnnouncements,
  getAnnouncementEnumValues
} from '@/features/announcements/services/announcements.service';
import { searchParamsCache } from '@/lib/searchparams';

export default async function AnnouncementsPage({
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
  const type = searchParamsCache.get('type');

  // Created At date range filter
  const createdAtRange = searchParamsCache.get('created_at');
  const created_at_from = createdAtRange?.[0]
    ? new Date(createdAtRange[0]).toISOString()
    : undefined;
  let created_at_to = createdAtRange?.[1]
    ? new Date(createdAtRange[1]).toISOString()
    : undefined;

  // If only one date is selected, treat as single day range
  if (!created_at_to && created_at_from) {
    created_at_to = created_at_from;
  }

  const { data, totalCount } = await getAnnouncements({
    page,
    pageSize: pageLimit,
    search: search || undefined,
    title_en: title_en || undefined,
    type: type && type.length > 0 ? type : undefined,
    created_at_from,
    created_at_to
  });

  const enumValues = await getAnnouncementEnumValues();

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            In-App Announcements
          </h2>
        </div>
        <Card className='flex flex-1 flex-col'>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col'>
            <AnnouncementsTable
              data={data}
              totalItems={totalCount}
              enumValues={enumValues}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
