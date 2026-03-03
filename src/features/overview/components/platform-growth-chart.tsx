'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { MonthlyGrowth } from '../services/platform-growth.service';

interface PlatformGrowthChartProps {
  data: MonthlyGrowth[];
}

const chartConfig = {
  users: {
    label: 'Users',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function PlatformGrowthChart({ data }: PlatformGrowthChartProps) {
  return (
    <Card className='@container/card flex h-full flex-col'>
      <CardHeader>
        <CardTitle>Platform Growth</CardTitle>
        <CardDescription>
          Total new users per month ({new Date().getFullYear()})
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-1 px-2 pt-4 sm:px-6 sm:pt-6'>
        {data.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[250px] w-full'
          >
            <AreaChart
              data={data}
              margin={{
                left: 12,
                right: 12
              }}
            >
              <defs>
                <linearGradient id='fillUsers' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-users)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-users)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='month'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='dot' />}
              />
              <Area
                dataKey='users'
                type='monotone'
                fill='url(#fillUsers)'
                stroke='var(--color-users)'
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className='text-muted-foreground flex h-[250px] items-center justify-center text-sm'>
            No data available for the selected period
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Tracking user registrations <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              Year {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
