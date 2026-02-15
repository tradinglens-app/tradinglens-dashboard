'use client';

import {
  CommunityUser,
  CommunityUserSummary
} from '@/features/community/users/services/community-users.service';
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
  HelpCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { DetailSheetHeader } from '@/components/ui/detail-sheet-header';
import { DetailInfoRow } from '@/components/ui/detail-info-row';
import { StatusBadge } from '@/components/ui/status-badge';
import { useEffect, useState } from 'react';
import { getUserDetails } from '../actions/get-user-details.action';
import { toast } from 'sonner';

interface UserDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user: CommunityUserSummary | null;
}

export function UserDetailSheet({
  isOpen,
  onClose,
  user
}: UserDetailSheetProps) {
  const [fullUser, setFullUser] = useState<CommunityUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.id) {
      const fetchDetails = async () => {
        setIsLoading(true);
        const result = await getUserDetails(user.id);
        if (result.error) {
          toast.error(result.error);
        } else {
          setFullUser(result.data);
        }
        setIsLoading(false);
      };

      // Reset full user state when opening new user
      setFullUser(null);
      fetchDetails();
    }
  }, [isOpen, user?.id]);

  if (!user) return null;

  // Use full details if available, otherwise fall back to summary data where possible
  const displayUser = fullUser || (user as unknown as CommunityUser);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full p-0 sm:max-w-xl' side='right'>
        <div className='flex h-full flex-col'>
          <DetailSheetHeader
            avatar={{
              src: displayUser.profilePic || null,
              fallback: displayUser.userName?.charAt(0)?.toUpperCase() || 'U'
            }}
            title={displayUser.userName || 'Unknown User'}
            subtitle={`@${displayUser.username || 'unknown'}`}
            badges={
              <>
                <StatusBadge
                  status={displayUser.status}
                  colorMap={{
                    Verified: 'green',
                    Pending: 'yellow',
                    Rejected: 'red'
                  }}
                  defaultColor='gray'
                />
                <StatusBadge
                  status={displayUser.accountStatus}
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
                <Badge variant='outline'>ID: {displayUser.id}</Badge>
              </>
            }
            description='Detailed view of the community user'
          />

          <div className='flex-1 overflow-y-auto px-6'>
            {isLoading ? (
              <div className='flex h-40 items-center justify-center'>
                <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
              </div>
            ) : (
              <div className='space-y-6 pb-6'>
                {/* User Info */}
                <div className='grid gap-4 py-4'>
                  <DetailInfoRow
                    icon={UserIcon}
                    label='Username'
                    value={`@${displayUser.username}`}
                  />

                  <DetailInfoRow
                    icon={Mail}
                    label='Email'
                    value={displayUser.email}
                  />

                  <DetailInfoRow
                    icon={CalendarDays}
                    label='Joined At'
                    value={displayUser.date}
                  />

                  <DetailInfoRow
                    icon={Activity}
                    label='Account Status'
                    value={
                      <span className='capitalize'>
                        {displayUser.accountStatus || 'N/A'}
                      </span>
                    }
                  />

                  {displayUser.statusMessage && (
                    <DetailInfoRow
                      icon={MessageCircle}
                      label='Status Message'
                      value={displayUser.statusMessage}
                    />
                  )}

                  <DetailInfoRow
                    icon={Clock}
                    label='Last Login'
                    value={displayUser.lastLogin}
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
                        <p
                          className='truncate'
                          title={displayUser.bio || 'N/A'}
                        >
                          {displayUser.bio || 'N/A'}
                        </p>
                      }
                    />
                    <DetailInfoRow
                      icon={Calendar}
                      label='Birthdate'
                      value={displayUser.birthdate || 'N/A'}
                    />
                    <DetailInfoRow
                      icon={Globe}
                      label='Language'
                      value={
                        <span className='uppercase'>
                          {displayUser.languagePreference || 'N/A'}
                        </span>
                      }
                    />
                    <DetailInfoRow
                      icon={Palette}
                      label='Theme'
                      value={
                        <span className='capitalize'>
                          {displayUser.themePreference || 'Default'}
                        </span>
                      }
                    />
                    <DetailInfoRow
                      icon={CheckCircle2}
                      label='Onboarding'
                      value={
                        displayUser.onboardingCompleted
                          ? 'Completed'
                          : 'Incomplete'
                      }
                    />
                    <DetailInfoRow
                      icon={HelpCircle}
                      label='Used Trial'
                      value={displayUser.hasUsedTrial ? 'Yes' : 'No'}
                    />
                    {displayUser.trialUsedAt && (
                      <DetailInfoRow
                        icon={Calendar}
                        label='Trial Used At'
                        value={displayUser.trialUsedAt}
                      />
                    )}
                    <DetailInfoRow
                      icon={Clock}
                      label='Updated At'
                      value={displayUser.updatedAt || 'N/A'}
                    />
                  </div>
                </div>

                <Separator />

                {/* System IDs */}
                <div className='grid gap-4 py-4'>
                  <h4 className='text-sm font-semibold'>System IDs</h4>
                  <div className='text-muted-foreground space-y-2 text-xs break-all'>
                    {displayUser.googleId && (
                      <p>Google ID: {displayUser.googleId}</p>
                    )}
                    {displayUser.appleId && (
                      <p>Apple ID: {displayUser.appleId}</p>
                    )}
                    {displayUser.stripeCustomerId && (
                      <p>Stripe ID: {displayUser.stripeCustomerId}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
