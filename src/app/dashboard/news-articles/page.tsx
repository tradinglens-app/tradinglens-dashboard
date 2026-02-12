import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { getNewsAction } from '@/features/news-articles/actions/news-actions';
import { NewsListing } from '@/features/news-articles/components/news-listing';

export default async function NewsArticlesPage() {
  const { data: news, totalCount } = await getNewsAction({
    page: 1,
    pageSize: 20
  });

  return (
    <PageContainer
      pageTitle='News & Articles'
      pageDescription='Manage news and articles'
      pageHeaderAction={
        <Link
          href='/dashboard/news/new'
          className={cn(buttonVariants(), 'text-xs md:text-sm')}
        >
          <Icons.add className='mr-2 h-4 w-4' /> Create New
        </Link>
      }
    >
      <NewsListing data={news} totalCount={totalCount} />
    </PageContainer>
  );
}
