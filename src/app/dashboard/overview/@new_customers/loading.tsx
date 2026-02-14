import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewCustomersLoading() {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='space-y-3'>
          <Skeleton className='h-4 w-[100px]' />
          <Skeleton className='h-8 w-[120px]' />
          <div className='space-y-2'>
            <Skeleton className='h-3 w-[150px]' />
            <Skeleton className='h-3 w-[180px]' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
