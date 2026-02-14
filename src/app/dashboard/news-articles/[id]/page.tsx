import PageContainer from '@/components/layout/page-container';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { NewsForm } from '@/features/news-articles/components/news-form';
import { getNewsByIdAction } from '@/features/news-articles/actions/news-actions';
import { notFound } from 'next/navigation';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'News & Articles', link: '/dashboard/news-articles' },
  { title: 'Edit', link: '/dashboard/news-articles/edit' }
];

export default async function EditNewsPage({
  params
}: {
  params: Promise<any>;
}) {
  const { id } = await params;
  const news = await getNewsByIdAction(id);

  if (!news) {
    notFound();
  }

  return (
    <PageContainer scrollable={true}>
      <div className='space-y-4'>
        <Breadcrumbs />
        <NewsForm initialData={news} />
      </div>
    </PageContainer>
  );
}
