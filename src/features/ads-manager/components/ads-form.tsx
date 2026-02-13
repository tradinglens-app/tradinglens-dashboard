'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Ad } from '../services/ads.service';
import { createAdAction, updateAdAction } from '../actions/ads-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  title_en: z.string().optional(),
  title_th: z.string().optional(),
  description_en: z.string().optional(),
  description_th: z.string().optional(),
  content_en: z.string().optional(),
  content_th: z.string().optional(),
  button_text_en: z.string().optional(),
  button_text_th: z.string().optional(),
  image_banner_dark: z.string().optional(),
  image_banner_white: z.string().optional(),
  path: z.string().optional(),
  type: z.string().optional()
});

type AdsFormValues = z.infer<typeof formSchema>;

interface AdsFormProps {
  initialData: Ad | null;
}

export function AdsForm({ initialData }: AdsFormProps) {
  const router = useRouter();
  const form = useForm<AdsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title_en: initialData.title_en || '',
          title_th: initialData.title_th || '',
          description_en: initialData.description_en || '',
          description_th: initialData.description_th || '',
          content_en: initialData.content_en || '',
          content_th: initialData.content_th || '',
          button_text_en: initialData.button_text_en || '',
          button_text_th: initialData.button_text_th || '',
          image_banner_dark: initialData.image_banner_dark || '',
          image_banner_white: initialData.image_banner_white || '',
          path: initialData.path || '',
          type: initialData.type || ''
        }
      : {
          title_en: '',
          title_th: '',
          description_en: '',
          description_th: '',
          content_en: '',
          content_th: '',
          button_text_en: '',
          button_text_th: '',
          image_banner_dark: '',
          image_banner_white: '',
          path: '',
          type: ''
        }
  });

  const onSubmit = async (data: AdsFormValues) => {
    // Filter out undefined values to avoid sending them to Prisma
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    if (initialData) {
      const result = await updateAdAction(initialData.id, cleanData);
      if (result.success) {
        toast.success('Ad updated successfully');
        router.push('/dashboard/ads-manager');
        router.refresh();
      } else {
        toast.error('Failed to update ad');
      }
    } else {
      const result = await createAdAction(cleanData as any);
      if (result.success) {
        toast.success('Ad created successfully');
        router.push('/dashboard/ads-manager');
        router.refresh();
      } else {
        toast.error('Failed to create ad');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Ad' : 'Create New Ad'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8'
        >
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>English Content</h3>
              <Separator />
              <FormField
                control={form.control}
                name='title_en'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (EN)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter English title'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description_en'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (EN)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter English description'
                        className='resize-none'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='content_en'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (EN)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter English content'
                        className='min-h-[150px]'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='button_text_en'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text (EN)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Button text'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Thai Content</h3>
              <Separator />
              <FormField
                control={form.control}
                name='title_th'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (TH)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter Thai title'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description_th'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (TH)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter Thai description'
                        className='resize-none'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='content_th'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (TH)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter Thai content'
                        className='min-h-[150px]'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='button_text_th'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text (TH)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Button text'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Configuration</h3>
            <Separator />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., banner, popup'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='path'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Path / URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='/path/to/feature'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='image_banner_dark'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image (Dark Mode)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Image URL'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='image_banner_white'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image (Light Mode)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Image URL'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type='submit' className='ml-auto'>
            {initialData ? 'Save Changes' : 'Create Ad'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
