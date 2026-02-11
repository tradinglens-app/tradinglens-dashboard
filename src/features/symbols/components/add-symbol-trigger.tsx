'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { SymbolFormModal } from './symbol-form-modal';

export function AddSymbolTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className='text-xs md:text-sm'>
        <Icons.add className='mr-2 h-4 w-4' /> Add Symbol
      </Button>
      <SymbolFormModal open={open} onOpenChange={setOpen} />
    </>
  );
}
