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
import { Announcement } from '../services/announcements.service';
import { deleteAnnouncementAction } from '../actions/announcements-actions';
import { toast } from 'sonner';

interface AnnouncementsDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: Announcement;
}

export function AnnouncementsDeleteDialog({
  open,
  onOpenChange,
  announcement
}: AnnouncementsDeleteDialogProps) {
  const handleDelete = async () => {
    const result = await deleteAnnouncementAction(announcement.id);
    if (result.success) {
      toast.success('Announcement deleted successfully');
      onOpenChange(false);
    } else {
      toast.error('Failed to delete announcement');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            announcement &quot;{announcement.title_en || announcement.title_th}
            &quot;.
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
