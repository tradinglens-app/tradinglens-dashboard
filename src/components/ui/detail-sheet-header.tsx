'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DetailSheetHeaderProps {
  avatar?: {
    src: string | null;
    fallback: string;
  };
  icon?: {
    Icon: LucideIcon;
    className?: string;
  };
  title: string;
  subtitle?: string;
  badges?: React.ReactNode;
  description?: string;
  className?: string;
}

/**
 * DetailSheetHeader - Reusable header component for detail sheets
 *
 * Displays either an avatar or icon, title, subtitle, and optional badges.
 *
 * @example
 * ```tsx
 * <DetailSheetHeader
 *   avatar={{ src: user.profilePic, fallback: user.name[0] }}
 *   title={user.userName}
 *   subtitle={`@${user.username}`}
 *   badges={<Badge>{user.status}</Badge>}
 * />
 * ```
 */
export function DetailSheetHeader({
  avatar,
  icon,
  title,
  subtitle,
  badges,
  description = 'Detailed view',
  className
}: DetailSheetHeaderProps) {
  return (
    <SheetHeader className={cn('p-6 pb-2', className)}>
      <div className='flex items-start gap-4'>
        {avatar && (
          <Avatar className='h-12 w-12 flex-shrink-0'>
            <AvatarImage src={avatar.src || ''} alt={title} />
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        )}
        {icon && !avatar && (
          <div
            className={cn(
              'bg-primary/10 text-primary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full',
              icon.className
            )}
          >
            <icon.Icon className='h-6 w-6' />
          </div>
        )}
        <div className='flex-1'>
          <SheetTitle className='text-xl leading-tight font-bold'>
            {title}
          </SheetTitle>
          {subtitle && (
            <p className='text-muted-foreground mt-1 text-sm'>{subtitle}</p>
          )}
        </div>
      </div>
      {badges && <div className='mt-4 flex flex-wrap gap-2'>{badges}</div>}
      <SheetDescription className='sr-only'>{description}</SheetDescription>
    </SheetHeader>
  );
}
