'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { toLabel } from '@/lib/db-enums.utils';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Announcement } from '../services/announcements.service';
import {
  createAnnouncementAction,
  updateAnnouncementAction
} from '../actions/announcements-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  display_type: z.string().min(1, 'Display type is required'),
  title_en: z.string().min(1, 'English title is required'),
  title_th: z.string().min(1, 'Thai title is required'),
  message_en: z.string().min(1, 'English message is required'),
  message_th: z.string().min(1, 'Thai message is required'),
  button_text_en: z.string().optional(),
  button_text_th: z.string().optional(),
  action_type: z.string().optional(),
  action_value: z.string().optional(),
  platform: z.string().optional(),
  min_app_version: z.string().optional(),
  max_app_version: z.string().optional(),
  start_at: z.string().optional(),
  end_at: z.string().optional(),
  priority: z.coerce.number().optional(),
  is_active: z.boolean().optional(),
  dismissible: z.boolean().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface AnnouncementsFormProps {
  initialData: Announcement | null;
  enumValues: Record<string, string[]>;
}

function toDatetimeLocal(date: Date | string | null): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function AnnouncementsForm({
  initialData,
  enumValues
}: AnnouncementsFormProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData
      ? {
          type: initialData.type || '',
          display_type: initialData.display_type || '',
          title_en: initialData.title_en || '',
          title_th: initialData.title_th || '',
          message_en: initialData.message_en || '',
          message_th: initialData.message_th || '',
          button_text_en: initialData.button_text_en || '',
          button_text_th: initialData.button_text_th || '',
          action_type: initialData.action_type || '',
          action_value: initialData.action_value || '',
          platform: initialData.platform || 'all',
          min_app_version: initialData.min_app_version || '',
          max_app_version: initialData.max_app_version || '',
          start_at: toDatetimeLocal(initialData.start_at),
          end_at: toDatetimeLocal(initialData.end_at),
          priority: initialData.priority ?? 0,
          is_active: initialData.is_active ?? true,
          dismissible: initialData.dismissible ?? true
        }
      : {
          type: '',
          display_type: '',
          title_en: '',
          title_th: '',
          message_en: '',
          message_th: '',
          button_text_en: '',
          button_text_th: '',
          action_type: '',
          action_value: '',
          platform: 'all',
          min_app_version: '',
          max_app_version: '',
          start_at: '',
          end_at: '',
          priority: 0,
          is_active: true,
          dismissible: true
        }
  });

  const onSubmit = async (data: FormValues) => {
    const payload: any = {
      ...data,
      button_text_en: data.button_text_en || null,
      button_text_th: data.button_text_th || null,
      action_type: data.action_type || null,
      action_value: data.action_value || null,
      platform: data.platform || 'all',
      min_app_version: data.min_app_version || null,
      max_app_version: data.max_app_version || null,
      start_at: data.start_at ? new Date(data.start_at) : null,
      end_at: data.end_at ? new Date(data.end_at) : null,
      priority: data.priority ?? 0,
      is_active: data.is_active ?? true,
      dismissible: data.dismissible ?? true
    };

    if (initialData) {
      const result = await updateAnnouncementAction(initialData.id, payload);
      if (result.success) {
        toast.success('Announcement updated successfully');
        router.push('/dashboard/announcements');
        router.refresh();
      } else {
        toast.error('Failed to update announcement');
      }
    } else {
      const result = await createAnnouncementAction(payload);
      if (result.success) {
        toast.success('Announcement created successfully');
        router.push('/dashboard/announcements');
        router.refresh();
      } else {
        toast.error('Failed to create announcement');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Announcement' : 'Create New Announcement'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8'
        >
          {/* Bilingual Content */}
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
                name='message_en'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (EN)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter English message'
                        className='min-h-[100px]'
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
                        placeholder='e.g., Learn More'
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
                name='message_th'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (TH)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter Thai message'
                        className='min-h-[100px]'
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
                        placeholder='e.g., ดูเพิ่มเติม'
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

          {/* Configuration */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Configuration</h3>
            <Separator />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(enumValues.type || []).map((v) => (
                          <SelectItem key={v} value={v}>
                            {toLabel(v)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='display_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select display type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(enumValues.display_type || []).map((v) => (
                          <SelectItem key={v} value={v}>
                            {toLabel(v)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='platform'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || 'all'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select platform' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(enumValues.platform || []).map((v) => (
                          <SelectItem key={v} value={v}>
                            {toLabel(v)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='action_type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select action type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(enumValues.action_type || []).map((v) => (
                          <SelectItem key={v} value={v}>
                            {toLabel(v)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='action_value'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action Value</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., https://...'
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
                name='priority'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='0'
                        {...field}
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Version & Scheduling */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Version & Scheduling</h3>
            <Separator />
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='min_app_version'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min App Version</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., 1.0.0'
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
                name='max_app_version'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max App Version</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., 2.0.0'
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
                name='start_at'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start At</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
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
                name='end_at'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End At</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
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

          {/* Toggles */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Options</h3>
            <Separator />
            <div className='flex flex-wrap gap-8'>
              <FormField
                control={form.control}
                name='is_active'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-2 space-y-0'>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className='cursor-pointer'>Active</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dismissible'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-2 space-y-0'>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className='cursor-pointer'>
                      Dismissible
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type='submit' className='ml-auto'>
            {initialData ? 'Save Changes' : 'Create Announcement'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
