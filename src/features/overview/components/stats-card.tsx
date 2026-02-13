import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconMinus
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
  description?: string;
}

export function StatsCard({
  title,
  value,
  percentageChange,
  trend,
  description
}: StatsCardProps) {
  const TrendIcon =
    trend === 'up'
      ? IconArrowUpRight
      : trend === 'down'
        ? IconArrowDownRight
        : IconMinus;

  const trendColor =
    trend === 'up'
      ? 'text-green-600 dark:text-green-400'
      : trend === 'down'
        ? 'text-red-600 dark:text-red-400'
        : 'text-gray-600 dark:text-gray-400';

  const badgeVariant = trend === 'neutral' ? 'secondary' : 'outline';

  // Custom background colors for the badge based on trend
  const badgeClass =
    trend === 'up'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-transparent'
      : trend === 'down'
        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-transparent'
        : '';

  const statusMessage =
    trend === 'down'
      ? 'Acquisition needs attention'
      : trend === 'up'
        ? 'Great growth momentum'
        : 'Steady acquisition rate';

  return (
    <Card className='@container/card'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardDescription>{title}</CardDescription>
        <Badge variant={badgeVariant} className={badgeClass}>
          <TrendIcon className='mr-1 h-4 w-4' />
          {Math.abs(percentageChange)}%
        </Badge>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value.toLocaleString()}</div>
        <div className='mt-2 flex flex-col gap-1'>
          <p className={cn('flex items-center gap-1 text-xs', trendColor)}>
            <TrendIcon className='h-3 w-3' />
            <span>
              {trend === 'down' ? 'Down' : trend === 'up' ? 'Up' : 'No change'}{' '}
              {Math.abs(percentageChange)}% this period
            </span>
          </p>
          <p className='text-muted-foreground text-xs'>{statusMessage}</p>
        </div>
        {description && (
          <p className='text-muted-foreground mt-2 text-xs'>{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
