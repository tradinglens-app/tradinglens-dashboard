'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DetailInfoRowProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  className?: string;
}

/**
 * DetailInfoRow - Reusable component for displaying information with an icon
 *
 * Used in detail sheets to show labeled data with consistent styling.
 *
 * @example
 * ```tsx
 * <DetailInfoRow
 *   icon={Calendar}
 *   label="Created At"
 *   value={format(date, 'PPP p')}
 * />
 * ```
 */
export function DetailInfoRow({
  icon: Icon,
  label,
  value,
  className
}: DetailInfoRowProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Icon className='text-muted-foreground h-5 w-5 flex-shrink-0' />
      <div className='flex-1 space-y-1'>
        <p className='text-sm leading-none font-medium'>{label}</p>
        <div className='text-muted-foreground text-sm'>{value}</div>
      </div>
    </div>
  );
}
