'use client';

import { formatDateApp } from '@/lib/format';
import { cn } from '@/lib/utils';

interface DateCellProps {
  date: Date | string | number | null | undefined;
  className?: string;
}

/**
 * DateCell - Reusable component for displaying dates in table cells
 *
 * Uses formatDateApp for consistent formatting and handles null/undefined values.
 * Wraps content in a whitespace-nowrap div to prevent wrapping in tables.
 */
export function DateCell({ date, className }: DateCellProps) {
  return (
    <div className={cn('whitespace-nowrap', className)}>
      {formatDateApp(date)}
    </div>
  );
}
