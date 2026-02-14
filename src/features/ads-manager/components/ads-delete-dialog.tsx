'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Ad } from '../services/ads.service';
import { deleteAdAction } from '../actions/ads-actions';
import { toast } from 'sonner';

interface AdsDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ad: Ad;
}

export function AdsDeleteDialog({
  open,
  onOpenChange,
  ad
}: AdsDeleteDialogProps) {
  const handleDelete = async () => {
    const result = await deleteAdAction(ad.id);
    if (result.success) {
      toast.success('Ad deleted successfully');
      onOpenChange(false);
    } else {
      toast.error('Failed to delete ad');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the ad "
            {ad.title_en || ad.title_th}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className='bg-red-600 focus:ring-red-600'
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
