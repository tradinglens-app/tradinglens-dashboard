'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  createProviderAction,
  updateProviderAction
} from '../actions/provider-actions';
import { ProviderConfig } from '../services/news-providers.service';
import { IconPlus } from '@tabler/icons-react';

interface ProviderDialogProps {
  provider?: ProviderConfig;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProviderDialog({
  provider,
  trigger,
  open,
  onOpenChange
}: ProviderDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const show = isControlled ? open : internalOpen;
  const setShow = isControlled ? onOpenChange : setInternalOpen;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = provider
      ? await updateProviderAction(provider.id, formData)
      : await createProviderAction(formData);

    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setShow?.(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && !isControlled && (
        <DialogTrigger asChild>
          <Button>
            <IconPlus className='mr-2 h-4 w-4' /> Add Provider
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {provider ? 'Edit Provider' : 'Add News Provider'}
            </DialogTitle>
            <DialogDescription>
              {provider
                ? 'Update the provider details below.'
                : 'Create a new news service provider configuration.'}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                id='name'
                name='name'
                defaultValue={provider?.name}
                className='col-span-3'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='enabled' className='text-right'>
                Enabled
              </Label>
              <div className='col-span-3 flex items-center space-x-2'>
                <Switch
                  id='enabled'
                  name='enabled'
                  value='true'
                  defaultChecked={provider?.enabled ?? true}
                />
                <Label htmlFor='enabled' className='font-normal'>
                  Active
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={loading}>
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
