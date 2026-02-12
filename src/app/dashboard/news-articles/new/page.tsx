import PageContainer from '@/components/layout/page-container';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { NewsForm } from '@/features/news-articles/components/news-form';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'News & Articles', link: '/dashboard/news-articles' },
  { title: 'Create', link: '/dashboard/news-articles/new' }
];

export default function CreateNewsPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='space-y-4'>
        <Breadcrumbs />
        <NewsForm />
      </div>
    </PageContainer>
  );
}
