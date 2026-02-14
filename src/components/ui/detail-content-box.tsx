'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DetailContentBoxProps {
  icon?: LucideIcon;
  label: string;
  content: React.ReactNode | null;
  placeholder?: string;
  className?: string;
}

/**
 * DetailContentBox - Reusable component for displaying multiline content
 *
 * Used in detail sheets to show text content in a styled box with optional icon.
 *
 * @example
 * ```tsx
 * <DetailContentBox
 *   icon={AlignLeft}
 *   label="Details"
 *   content={report.details}
 *   placeholder="No details provided"
 * />
 * ```
 */
export function DetailContentBox({
  icon: Icon,
  label,
  content,
  placeholder = 'No content',
  className
}: DetailContentBoxProps) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      {Icon && (
        <Icon className='text-muted-foreground mt-0.5 h-5 w-5 flex-shrink-0' />
      )}
      <div className='w-full space-y-1'>
        <p className='text-sm leading-none font-medium'>{label}</p>
        <div className='bg-muted text-foreground mt-2 rounded-md p-4 text-sm leading-relaxed whitespace-pre-wrap'>
          {content || (
            <span className='text-muted-foreground italic'>{placeholder}</span>
          )}
        </div>
      </div>
    </div>
  );
}
