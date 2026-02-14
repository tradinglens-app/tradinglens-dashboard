'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ComponentPropsWithoutRef } from 'react';

type ColorVariant =
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'blue'
  | 'purple'
  | 'gray';

interface StatusBadgeProps
  extends Omit<ComponentPropsWithoutRef<typeof Badge>, 'variant'> {
  status: string | null;
  colorMap?: Record<string, ColorVariant>;
  defaultColor?: ColorVariant;
}

const colorClasses: Record<ColorVariant, string> = {
  green: 'border-green-200 bg-green-100 text-green-800 hover:bg-green-100',
  yellow: 'border-yellow-200 bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  orange: 'border-orange-200 bg-orange-100 text-orange-800 hover:bg-orange-100',
  red: 'border-red-200 bg-red-100 text-red-800 hover:bg-red-100',
  blue: 'border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100',
  purple: 'border-purple-200 bg-purple-100 text-purple-800 hover:bg-purple-100',
  gray: 'border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-100'
};

/**
 * StatusBadge - Reusable badge component with automatic color mapping
 *
 * Displays status with appropriate colors based on the status value.
 *
 * @example
 * ```tsx
 * <StatusBadge
 *   status={user.accountStatus}
 *   colorMap={{
 *     NORMAL: 'green',
 *     WARNING: 'yellow',
 *     BANNED: 'red'
 *   }}
 * />
 * ```
 */
export function StatusBadge({
  status,
  colorMap,
  defaultColor = 'gray',
  className,
  ...props
}: StatusBadgeProps) {
  if (!status) return null;

  const color = colorMap?.[status] || defaultColor;
  const colorClass = colorClasses[color];

  return (
    <Badge variant='outline' className={cn(colorClass, className)} {...props}>
      {status}
    </Badge>
  );
}
