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
import React, { Suspense } from 'react';
import { StatsCard } from '@/features/overview/components/stats-card';
import { getOverviewData } from '@/features/overview/services/overview-data.service';
import { AreaGraphSkeleton } from '@/features/overview/components/area-graph-skeleton';
import { BarGraphSkeleton } from '@/features/overview/components/bar-graph-skeleton';
import { PieGraphSkeleton } from '@/features/overview/components/pie-graph-skeleton';
import { RecentSalesSkeleton } from '@/features/overview/components/recent-sales-skeleton';
import { DashboardRefresh } from '@/features/overview/components/dashboard-refresh';

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
  const { stats } = await getOverviewData();

  return (
    <PageContainer>
      <DashboardRefresh />
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <StatsCard
            title='Total Users'
            value={stats.totalUsers.current}
            percentageChange={stats.totalUsers.percentageChange}
            trend={stats.totalUsers.trend}
            description='Total registered users across all platforms'
          />
          {new_customers}
          <StatsCard
            title='iOS Users'
            value={stats.iosUsers.current}
            percentageChange={stats.iosUsers.percentageChange}
            trend={stats.iosUsers.trend}
            description='Total users with active iOS devices'
          />
          <StatsCard
            title='Android Users'
            value={stats.androidUsers.current}
            percentageChange={stats.androidUsers.percentageChange}
            trend={stats.androidUsers.trend}
            description='Total users with active Android devices'
          />
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>
            <Suspense fallback={<BarGraphSkeleton />}>{bar_stats}</Suspense>
          </div>
          <div className='col-span-4 md:col-span-3'>
            <Suspense fallback={<RecentSalesSkeleton />}>{sales}</Suspense>
          </div>
          <div className='col-span-4'>
            <Suspense fallback={<AreaGraphSkeleton />}>{area_stats}</Suspense>
          </div>
          <div className='col-span-4 md:col-span-3'>
            <Suspense fallback={<PieGraphSkeleton />}>{pie_stats}</Suspense>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
