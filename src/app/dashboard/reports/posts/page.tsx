import PageContainer from '@/components/layout/page-container';
import { PostReportListing } from '@/features/reports/posts/components/post-report-listing';
import { getPostReports } from '@/features/reports/posts/services/post-report.service';

export default async function PostReportsPage() {
  const postReports = await getPostReports();

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Post Reports</h2>
        </div>
        <PostReportListing data={postReports} />
      </div>
    </PageContainer>
  );
}
