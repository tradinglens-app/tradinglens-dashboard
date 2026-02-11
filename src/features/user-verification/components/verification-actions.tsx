'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { updateVerificationStatus } from '../actions/user-actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface VerificationActionsProps {
  userId: string;
  userName: string;
  isVerified: boolean;
}

export function VerificationActions({
  userId,
  userName,
  isVerified
}: VerificationActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggleVerification = async () => {
    setLoading(true);
    const result = await updateVerificationStatus(userId, !isVerified);
    setLoading(false);
    if (result.success) {
      toast.success(isVerified ? 'Verification revoked' : 'User verified');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to update status');
    }
  };

  return (
    <div className='flex justify-end gap-2'>
      {isVerified ? (
        <Button
          variant='outline'
          size='sm'
          onClick={handleToggleVerification}
          disabled={loading}
          className='h-8 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
        >
          Revoke
        </Button>
      ) : (
        <Button
          variant='outline'
          size='sm'
          onClick={handleToggleVerification}
          disabled={loading}
          className='h-8 border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700'
        >
          Grant Verified
        </Button>
      )}
    </div>
  );
}
