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
        : 'text-muted-foreground';

  const badgeClass = cn(
    'font-medium border-transparent',
    trend === 'up' &&
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    trend === 'down' &&
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    trend === 'neutral' && 'bg-muted text-muted-foreground'
  );

  const statusLabel =
    trend === 'up' ? 'Trending up' : trend === 'down' ? 'Down' : 'Steady';

  return (
    <Card className='@container/card'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='flex flex-col gap-1'>
          <CardDescription className='text-xs font-medium tracking-wider uppercase'>
            {title}
          </CardDescription>
          <CardTitle className='text-2xl font-bold'>
            {value.toLocaleString()}
          </CardTitle>
        </div>
        <Badge
          variant='outline'
          className={cn('h-6 px-2 text-[10px]', badgeClass)}
        >
          <TrendIcon className='mr-1 h-3 w-3' />
          {trend === 'down' ? '-' : '+'}
          {Math.abs(percentageChange)}%
        </Badge>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='flex flex-col gap-1'>
          <p className='flex items-center gap-1 text-[11px] font-medium'>
            <span className={trendColor}>
              {statusLabel} {Math.abs(percentageChange)}% this month
            </span>
            <TrendIcon className={cn('h-3.5 w-3.5', trendColor)} />
          </p>
          {description && (
            <p className='text-muted-foreground text-[10px] leading-relaxed'>
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
