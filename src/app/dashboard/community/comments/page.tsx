import PageContainer from '@/components/layout/page-container';
import { searchParamsCache } from '@/lib/searchparams';
import { getComments } from '@/features/community/comments/services/comment.service';
import { CommentListing } from '@/features/community/comments/components/comment-listing';

export default async function CommentsPage({
  searchParams
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;
  searchParamsCache.parse(params);

  const page = searchParamsCache.get('page');
  const pageSize = searchParamsCache.get('perPage');
  const search = searchParamsCache.get('content');
  const createdAt = searchParamsCache.get('createdAt');

  const { data, totalCount } = await getComments({
    page,
    pageSize,
    search: search || undefined,
    createdAt: createdAt || undefined
  });

  return (
    <PageContainer
      pageTitle='Comments'
      pageDescription='Moderate community comments'
    >
      <div className='flex flex-col gap-4'>
        <CommentListing data={data} totalCount={totalCount} />
      </div>
    </PageContainer>
  );
}
