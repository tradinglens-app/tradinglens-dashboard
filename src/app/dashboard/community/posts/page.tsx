import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  getPosts,
  getPostEnumValues
} from '@/features/community/posts/services/posts.service';
import { PostsTable } from '@/features/community/posts/components/posts-table';
import { searchParamsCache } from '@/lib/searchparams';

export default async function PostsPage({
  searchParams
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;
  searchParamsCache.parse(params);

  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const content = searchParamsCache.get('content');
  const id = searchParamsCache.get('id');
  const visibility = searchParamsCache.get('visibility');
  const type = searchParamsCache.get('type');
  const createdAt = searchParamsCache.get('created_at');
  const pageSize = searchParamsCache.get('perPage');

  const [{ data, totalCount }, enumValues] = await Promise.all([
    getPosts({
      page,
      pageSize,
      search: content || search,
      id,
      visibility,
      type,
      created_at: createdAt
    }),
    getPostEnumValues()
  ]);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Posts'
      pageDescription='Moderate community posts'
    >
      <div className='flex flex-1 flex-col space-y-4'>
        <Card className='flex flex-1 flex-col'>
          <CardHeader>
            <CardTitle>Community Posts</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col'>
            <PostsTable
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
