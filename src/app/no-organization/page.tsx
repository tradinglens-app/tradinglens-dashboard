'use client';

import { SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { ShieldAlert, LogOut } from 'lucide-react';
import Image from 'next/image';

export default function NoOrganizationPage() {
  return (
    <div className='from-background to-muted/30 flex min-h-screen items-center justify-center bg-gradient-to-b'>
      <div className='mx-auto max-w-md space-y-8 px-4 text-center'>
        {/* Logo */}
        <div className='flex justify-center'>
          <div className='relative size-16'>
            <Image
              src='/assets/tradinglens.svg'
              alt='TradingLens'
              fill
              className='object-contain'
            />
          </div>
        </div>

        {/* Icon */}
        <div className='flex justify-center'>
          <div className='flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30'>
            <ShieldAlert className='h-10 w-10 text-amber-600 dark:text-amber-400' />
          </div>
        </div>

        {/* Message */}
        <div className='space-y-3'>
          <h1 className='text-2xl font-bold tracking-tight'>
            No Workspace Access
          </h1>
          <p className='text-muted-foreground leading-relaxed'>
            You are not currently a member of any workspace. Please contact your
            administrator to get invited to a workspace.
          </p>
        </div>

        {/* Actions */}
        <div className='flex flex-col gap-3'>
          <SignOutButton redirectUrl='/auth/sign-in'>
            <Button variant='outline' className='w-full gap-2'>
              <LogOut className='h-4 w-4' />
              Sign Out
            </Button>
          </SignOutButton>
        </div>

        {/* Footer */}
        <p className='text-muted-foreground text-xs'>
          If you believe this is an error, please contact your workspace
          administrator.
        </p>
      </div>
    </div>
  );
}
