'use client';

import * as React from 'react';
import { IconShieldCheck } from '@tabler/icons-react';
import { Cell, Label, Pie, PieChart } from 'recharts';

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
import { VerificationStats } from '../services/user-verification.service';

interface UserVerificationPieProps {
  stats: VerificationStats;
}

const chartConfig = {
  visitors: {
    label: 'Total Users'
  },
  verified: {
    label: 'Verified',
    color: 'var(--chart-1)'
  },
  unverified: {
    label: 'Unverified',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function UserVerificationPie({ stats }: UserVerificationPieProps) {
  const chartData = [
    {
      browser: 'verified',
      visitors: stats.verified,
      fill: 'url(#fillverified)'
    },
    {
      browser: 'unverified',
      visitors: stats.unverified,
      fill: 'url(#fillunverified)'
    }
  ];

  const totalUsers = stats.total;
  const verifiedPercentage =
    totalUsers > 0 ? ((stats.verified / totalUsers) * 100).toFixed(1) : '0';

  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>User Verification</CardTitle>
        <CardDescription>Verified vs Unverified Users</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <PieChart>
            <defs>
              {['verified', 'unverified'].map((id, index) => (
                <linearGradient
                  key={id}
                  id={`fill${id}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='0%'
                    stopColor='var(--chart-1)'
                    stopOpacity={1 - index * 0.7}
                  />
                  <stop
                    offset='100%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.8 - index * 0.7}
                  />
                </linearGradient>
              ))}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='visitors'
              nameKey='browser'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total Users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          {verifiedPercentage}% Verified Users{' '}
          <IconShieldCheck className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total verified user distribution
        </div>
      </CardFooter>
    </Card>
  );
}
