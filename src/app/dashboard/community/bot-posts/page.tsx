import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  getBotPosts,
  getPostEnumValues
} from '@/features/community/posts/services/posts.service';
import { BotPostsTable } from '@/features/community/posts/components/bot-posts-table';
import { searchParamsCache } from '@/lib/searchparams';

export default async function BotPostsPage({
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
  const sort = searchParamsCache.get('sort');

  const [{ data, totalCount }, enumValues] = await Promise.all([
    getBotPosts({
      page,
      pageSize,
      search: content || search,
      id,
      visibility,
      type,
      created_at: createdAt,
      sort
    }),
    getPostEnumValues()
  ]);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Bot Posts'
      pageDescription='Manage posts by @tradinglens.bot'
    >
      <div className='flex flex-1 flex-col space-y-4'>
        <Card className='flex flex-1 flex-col'>
          <CardHeader>
            <CardTitle>Bot Posts</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col'>
            <BotPostsTable
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
