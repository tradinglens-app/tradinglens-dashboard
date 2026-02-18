'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateManyNewsAction } from '../actions/news-actions';
import { toast } from 'sonner';

interface BulkEditNewsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSuccess: () => void;
}

export function BulkEditNewsDialog({
  isOpen,
  onClose,
  selectedIds,
  onSuccess
}: BulkEditNewsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleSave = async () => {
    if (!imageUrl) {
      onClose();
      return;
    }

    try {
      setLoading(true);
      const updateData: any = {};
      if (imageUrl) updateData.imageUrl = imageUrl;

      const result = await updateManyNewsAction(selectedIds, updateData);

      if (result.success) {
        toast.success(`Updated ${selectedIds.length} articles successfully.`);
        onSuccess();
        onClose();
        setImageUrl('');
      } else {
        toast.error(result.error || 'Failed to update articles.');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Bulk Edit News</DialogTitle>
          <DialogDescription>
            Applying changes to {selectedIds.length} selected articles. Only
            fields with values will be updated.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='imageUrl' className='text-right'>
              Image URL
            </Label>
            <Input
              id='imageUrl'
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder='https://example.com/image.jpg'
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !imageUrl}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
