import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import {
  IconBrandAndroid,
  IconBrandApple,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers
} from '@tabler/icons-react';
import React from 'react';
import prisma from '@/lib/prisma';

export default async function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats,
  new_customers
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
  new_customers: React.ReactNode;
}) {
  const userCount = await prisma.users.count();

  // Count distinct users for iOS and Android
  // Note: For large datasets, use raw query or aggregation. distinct findMany is acceptable for dashboard scale.
  const iosCount = (
    await prisma.user_devices.findMany({
      where: { platform: 'ios' },
      distinct: ['user_id'],
      select: { user_id: true }
    })
  ).length;

  const androidCount = (
    await prisma.user_devices.findMany({
      where: { platform: 'android' },
      distinct: ['user_id'],
      select: { user_id: true }
    })
  ).length;

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Users</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {userCount}
              </CardTitle>
              <CardAction>
                <div className='bg-primary/10 text-primary rounded-full p-2'>
                  <IconUsers className='size-5' />
                </div>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='text-muted-foreground'>
                Total registered users
              </div>
            </CardFooter>
          </Card>
          {new_customers}
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>iOS Users</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {iosCount}
              </CardTitle>
              <CardAction>
                <div className='bg-primary/10 text-primary rounded-full p-2'>
                  <IconBrandApple className='size-5' />
                </div>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='text-muted-foreground'>Active on iOS</div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Android Users</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {androidCount}
              </CardTitle>
              <CardAction>
                <div className='bg-primary/10 text-primary rounded-full p-2'>
                  <IconBrandAndroid className='size-5' />
                </div>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='text-muted-foreground'>Active on Android</div>
            </CardFooter>
          </Card>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {/* sales arallel routes */}
            {sales}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
