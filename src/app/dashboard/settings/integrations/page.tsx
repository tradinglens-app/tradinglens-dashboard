import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function IntegrationsPage() {
  return (
    <PageContainer
      pageTitle='Integrations'
      pageDescription='Manage third-party integrations'
      pageHeaderAction={
        <Link href='#' className={cn(buttonVariants(), 'text-xs md:text-sm')}>
          <Icons.add className='mr-2 h-4 w-4' /> Add Integration
        </Link>
      }
    >
      <div className='flex flex-col gap-4'>
        {/* Placeholder for Data Table */}
        <div className='rounded-md border p-4'>
          <p className='text-muted-foreground text-sm'>
            No integrations connected.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
