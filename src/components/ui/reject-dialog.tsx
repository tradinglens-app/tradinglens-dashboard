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

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  itemTitle: string;
  onConfirm: (note: string) => void;
}

export function RejectDialog({
  open,
  onOpenChange,
  title = 'Reject Report',
  itemTitle,
  onConfirm
}: RejectDialogProps) {
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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            You are about to reject:
            <div className='text-foreground mt-2 font-medium'>{itemTitle}</div>
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
            {isSubmitting ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
