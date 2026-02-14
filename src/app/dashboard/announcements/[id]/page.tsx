import PageContainer from '@/components/layout/page-container';
import { AnnouncementsForm } from '@/features/announcements/components/announcements-form';
import {
  getAnnouncementById,
  getAnnouncementEnumValues
} from '@/features/announcements/services/announcements.service';

export default async function AnnouncementEditPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === 'new';
  let announcement = null;

  if (!isNew) {
    const announcementId = parseInt(id);
    if (!isNaN(announcementId)) {
      announcement = await getAnnouncementById(announcementId);
    }
  }

  const enumValues = await getAnnouncementEnumValues();

  return (
    <PageContainer scrollable={true}>
      <div className='max-w-4xl space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            {isNew ? 'Create Announcement' : 'Edit Announcement'}
          </h2>
        </div>
        <AnnouncementsForm initialData={announcement} enumValues={enumValues} />
      </div>
    </PageContainer>
  );
}
