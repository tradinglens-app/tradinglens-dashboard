'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { SymbolData } from '@/features/symbols/services/symbol.service';
import { saveSymbolAction } from '@/features/symbols/actions/symbol-actions';
import { toast } from 'sonner';

const formSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').max(20),
  name: z
    .string()
    .min(1, 'Company name is required')
    .max(255)
    .nullable()
    .optional(),
  exchange: z.string().max(50).nullable().optional(),
  type: z.string().nullable().optional(),
  logo: z
    .string()
    .url('Invalid URL')
    .or(z.string().length(0))
    .nullable()
    .optional()
});

type SymbolFormValues = z.infer<typeof formSchema>;

interface SymbolFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: SymbolData | null;
}

export function SymbolFormModal({
  open,
  onOpenChange,
  initialData
}: SymbolFormModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<SymbolFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: '',
      name: '',
      exchange: '',
      type: 'Stock',
      logo: ''
    }
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          symbol: initialData.symbol,
          name: initialData.name || '',
          exchange: initialData.exchange || '',
          type: initialData.type || 'Stock',
          logo: initialData.logo || ''
        });
      } else {
        form.reset({
          symbol: '',
          name: '',
          exchange: '',
          type: 'Stock',
          logo: ''
        });
      }
    }
  }, [initialData, open, form]);

  const onSubmit = async (values: SymbolFormValues) => {
    setLoading(true);
    const result = await saveSymbolAction({
      ...values,
      id: initialData?.id
    });
    setLoading(false);

    if (result.success) {
      toast.success(initialData ? 'Symbol updated' : 'Symbol created');
      onOpenChange(false);
    } else {
      toast.error(result.error || 'Failed to save symbol');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Symbol' : 'Add New Symbol'}
          </DialogTitle>
        </DialogHeader>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 py-4'
        >
          <FormInput
            control={form.control}
            name='symbol'
            label='Symbol'
            placeholder='e.g. AAPL'
            required
          />

          <FormInput
            control={form.control}
            name='name'
            label='Company Name'
            placeholder='e.g. Apple Inc.'
            required
          />

          <FormInput
            control={form.control}
            name='exchange'
            label='Exchange'
            placeholder='e.g. NASDAQ'
          />

          <FormSelect
            control={form.control}
            name='type'
            label='Asset Type'
            placeholder='Select type'
            options={[
              { label: 'Stock', value: 'Stock' },
              { label: 'ETF', value: 'ETF' },
              { label: 'Crypto', value: 'Crypto' },
              { label: 'Index', value: 'Index' }
            ]}
          />

          <FormInput
            control={form.control}
            name='logo'
            label='Logo URL'
            placeholder='https://example.com/logo.png'
          />

          <DialogFooter>
            <Button type='submit' disabled={loading}>
              {loading ? 'Saving...' : 'Save Symbol'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
