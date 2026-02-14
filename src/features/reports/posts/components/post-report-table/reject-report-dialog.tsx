'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface RejectReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postTitle: string;
  onConfirm: (note: string) => void;
}

export function RejectReportDialog({
  open,
  onOpenChange,
  postTitle,
  onConfirm
}: RejectReportDialogProps) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirm(note);
    setIsSubmitting(false);
    setNote('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Reject Report</DialogTitle>
          <DialogDescription>
            You are about to reject the report for:
            <div className='text-foreground mt-2 font-medium'>{postTitle}</div>
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-2'>
          <Label htmlFor='note'>Note (Optional)</Label>
          <Textarea
            id='note'
            placeholder='Enter reason for rejection...'
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Rejecting...' : 'Reject Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
