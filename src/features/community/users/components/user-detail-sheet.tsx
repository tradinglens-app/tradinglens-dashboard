'use client';

import { CommunityUser } from '@/features/community/users/services/community-users.service';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  CalendarDays,
  User as UserIcon,
  Mail,
  Shield,
  Activity,
  Clock,
  MessageCircle,
  Globe,
  Palette,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { DetailSheetHeader } from '@/components/ui/detail-sheet-header';
import { DetailInfoRow } from '@/components/ui/detail-info-row';
import { StatusBadge } from '@/components/ui/status-badge';

interface UserDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user: CommunityUser | null;
}

export function UserDetailSheet({
  isOpen,
  onClose,
  user
}: UserDetailSheetProps) {
  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full p-0 sm:max-w-xl' side='right'>
        <div className='flex h-full flex-col'>
          <DetailSheetHeader
            avatar={{
              src: user.profilePic || null,
              fallback: user.userName?.charAt(0)?.toUpperCase() || 'U'
            }}
            title={user.userName || 'Unknown User'}
            subtitle={`@${user.username || 'unknown'}`}
            badges={
              <>
                <StatusBadge
                  status={user.status}
                  colorMap={{
                    Verified: 'green',
                    Pending: 'yellow',
                    Rejected: 'red'
                  }}
                  defaultColor='gray'
                />
                <StatusBadge
                  status={user.accountStatus}
                  colorMap={{
                    NORMAL: 'green',
                    WARNING: 'yellow',
                    LIMITED: 'orange',
                    RESTRICTED: 'orange',
                    SUSPENDED: 'red',
                    BANNED: 'red',
                    UNDER_REVIEW: 'blue'
                  }}
                />
                <Badge variant='outline'>ID: {user.id}</Badge>
              </>
            }
            description='Detailed view of the community user'
          />

          <div className='flex-1 overflow-y-auto px-6'>
            <div className='space-y-6 pb-6'>
              {/* User Info */}
              <div className='grid gap-4 py-4'>
                <DetailInfoRow
                  icon={UserIcon}
                  label='Username'
                  value={`@${user.username}`}
                />

                <DetailInfoRow icon={Mail} label='Email' value={user.email} />

                <DetailInfoRow
                  icon={CalendarDays}
                  label='Joined At'
                  value={user.date}
                />

                <DetailInfoRow
                  icon={Activity}
                  label='Account Status'
                  value={
                    <span className='capitalize'>
                      {user.accountStatus || 'N/A'}
                    </span>
                  }
                />

                {user.statusMessage && (
                  <DetailInfoRow
                    icon={MessageCircle}
                    label='Status Message'
                    value={user.statusMessage}
                  />
                )}

                <DetailInfoRow
                  icon={Clock}
                  label='Last Login'
                  value={user.lastLogin}
                />
              </div>

              <Separator />

              {/* Additional Details */}
              <div className='grid gap-4 py-4'>
                <h4 className='text-sm font-semibold'>
                  Additional Information
                </h4>

                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <DetailInfoRow
                    icon={UserIcon}
                    label='Bio'
                    value={
                      <p className='truncate' title={user.bio || 'N/A'}>
                        {user.bio || 'N/A'}
                      </p>
                    }
                  />
                  <DetailInfoRow
                    icon={Calendar}
                    label='Birthdate'
                    value={user.birthdate || 'N/A'}
                  />
                  <DetailInfoRow
                    icon={Globe}
                    label='Language'
                    value={
                      <span className='uppercase'>
                        {user.languagePreference}
                      </span>
                    }
                  />
                  <DetailInfoRow
                    icon={Palette}
                    label='Theme'
                    value={
                      <span className='capitalize'>
                        {user.themePreference || 'Default'}
                      </span>
                    }
                  />
                  <DetailInfoRow
                    icon={CheckCircle2}
                    label='Onboarding'
                    value={
                      user.onboardingCompleted ? 'Completed' : 'Incomplete'
                    }
                  />
                  <DetailInfoRow
                    icon={HelpCircle}
                    label='Used Trial'
                    value={user.hasUsedTrial ? 'Yes' : 'No'}
                  />
                  {user.trialUsedAt && (
                    <DetailInfoRow
                      icon={Calendar}
                      label='Trial Used At'
                      value={user.trialUsedAt}
                    />
                  )}
                  <DetailInfoRow
                    icon={Clock}
                    label='Updated At'
                    value={user.updatedAt || 'N/A'}
                  />
                </div>
              </div>

              <Separator />

              {/* System IDs */}
              <div className='grid gap-4 py-4'>
                <h4 className='text-sm font-semibold'>System IDs</h4>
                <div className='text-muted-foreground space-y-2 text-xs break-all'>
                  {user.googleId && <p>Google ID: {user.googleId}</p>}
                  {user.appleId && <p>Apple ID: {user.appleId}</p>}
                  {user.stripeCustomerId && (
                    <p>Stripe ID: {user.stripeCustomerId}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
