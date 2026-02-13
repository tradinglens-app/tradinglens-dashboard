'use client';

import { CommunityUser } from '../services/community-users.service';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Mail, User, Activity, Clock } from 'lucide-react';

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
          <SheetHeader className='p-6 pb-2'>
            <div className='flex items-start justify-between gap-4'>
              <SheetTitle className='text-xl leading-tight font-bold'>
                {user.userName}
              </SheetTitle>
            </div>
            <div className='mt-2 flex flex-wrap gap-2'>
              <Badge
                variant={user.status === 'Verified' ? 'default' : 'secondary'}
                className={
                  user.status === 'Verified'
                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                    : ''
                }
              >
                {user.status}
              </Badge>
              {user.accountStatus && (
                <Badge
                  variant={
                    user.accountStatus === 'NORMAL'
                      ? 'outline'
                      : user.accountStatus === 'BANNED' ||
                          user.accountStatus === 'SUSPENDED'
                        ? 'destructive'
                        : 'secondary'
                  }
                  className={
                    user.accountStatus === 'NORMAL'
                      ? 'border-green-200 bg-green-100 text-green-800'
                      : user.accountStatus === 'WARNING'
                        ? 'border-yellow-200 bg-yellow-100 text-yellow-800'
                        : user.accountStatus === 'LIMITED' ||
                            user.accountStatus === 'RESTRICTED'
                          ? 'border-orange-200 bg-orange-100 text-orange-800'
                          : user.accountStatus === 'UNDER_REVIEW'
                            ? 'border-blue-200 bg-blue-100 text-blue-800'
                            : ''
                  }
                >
                  {user.accountStatus}
                </Badge>
              )}
              <Badge variant='outline'>ID: {user.id}</Badge>
            </div>
            <SheetDescription className='sr-only'>
              Detailed view of the community user
            </SheetDescription>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-6'>
            <div className='space-y-6 pb-6'>
              {/* User Info */}
              <div className='grid gap-4 py-4'>
                <div className='flex items-center gap-3'>
                  <User className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>Username</p>
                    <p className='text-muted-foreground text-sm'>
                      @{user.username}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Mail className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>Email</p>
                    <p className='text-muted-foreground text-sm'>
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <CalendarDays className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      Joined At
                    </p>
                    <p className='text-muted-foreground text-sm'>{user.date}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Activity className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      Account Status
                    </p>
                    <p className='text-muted-foreground text-sm capitalize'>
                      {user.accountStatus || 'N/A'}
                    </p>
                  </div>
                </div>

                {user.statusMessage && (
                  <div className='flex items-center gap-3'>
                    <div className='flex h-5 w-5 items-center justify-center'>
                      <span className='text-muted-foreground text-xs'>💬</span>
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm leading-none font-medium'>
                        Status Message
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {user.statusMessage}
                      </p>
                    </div>
                  </div>
                )}

                <div className='flex items-center gap-3'>
                  <Clock className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      Last Login
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {user.lastLogin}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Details */}
              <div className='grid gap-4 py-4'>
                <h4 className='text-sm font-semibold'>
                  Additional Information
                </h4>

                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-muted-foreground'>Bio:</span>
                    <p className='font-medium'>{user.bio || 'N/A'}</p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Birthdate:</span>
                    <p className='font-medium'>{user.birthdate || 'N/A'}</p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Language:</span>
                    <p className='font-medium uppercase'>
                      {user.languagePreference}
                    </p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Theme:</span>
                    <p className='font-medium capitalize'>
                      {user.themePreference || 'Default'}
                    </p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Onboarding:</span>
                    <p className='font-medium'>
                      {user.onboardingCompleted ? 'Completed' : 'Incomplete'}
                    </p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Used Trial:</span>
                    <p className='font-medium'>
                      {user.hasUsedTrial ? 'Yes' : 'No'}
                    </p>
                  </div>
                  {user.trialUsedAt && (
                    <div>
                      <span className='text-muted-foreground'>
                        Trial Used At:
                      </span>
                      <p className='font-medium'>{user.trialUsedAt}</p>
                    </div>
                  )}
                  <div>
                    <span className='text-muted-foreground'>Updated At:</span>
                    <p className='font-medium'>{user.updatedAt || 'N/A'}</p>
                  </div>
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
