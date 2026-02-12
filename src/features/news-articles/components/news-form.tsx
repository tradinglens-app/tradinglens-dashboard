'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NewsArticle } from '../services/news.service';
import { saveNewsAction } from '../actions/news-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const newsFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.'
  }),
  symbol: z.string().min(1, {
    message: 'Symbol is required.'
  }),
  content: z.string().optional(),
  summary: z.string().optional(),
  titleTh: z.string().optional(),
  contentTh: z.string().optional(),
  summaryTh: z.string().optional(),
  imageUrl: z.string().optional(), // Simplify until complex validation is needed
  sourceUrl: z.string().optional(), // Simplify until complex validation is needed
  publisher: z.string().optional(),
  language: z.string().default('en'),
  publishedDate: z.date().default(new Date()),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isHot: z.boolean().default(false),
  tags: z.string().optional(), // Comma separated string for input
  categories: z.string().optional() // JSON string or comma separated for simplicity
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

interface NewsFormProps {
  initialData?: NewsArticle | null;
}

export function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const thaiTranslation = initialData?.translations?.find(
    (t) => t.language === 'th'
  );

  const defaultValues: Partial<NewsFormValues> = {
    title: initialData?.title || '',
    symbol: initialData?.symbol || '',
    content: initialData?.content || '',
    summary: initialData?.summary || '',
    titleTh: thaiTranslation?.title || '',
    contentTh: thaiTranslation?.content || '',
    summaryTh: thaiTranslation?.summary || '',
    imageUrl: initialData?.imageUrl || '',
    sourceUrl: initialData?.sourceUrl || '',
    publisher: initialData?.publisher || '',
    language: initialData?.language || 'en',
    publishedDate: initialData?.publishedDate
      ? new Date(initialData.publishedDate)
      : new Date(),
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    isHot: initialData?.isHot ?? false,
    tags: initialData?.tags?.join(', ') || '',
    categories:
      typeof initialData?.categories === 'string'
        ? initialData.categories
        : Array.isArray(initialData?.categories)
          ? initialData.categories.join(', ')
          : ''
  };

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema) as any,
    defaultValues: defaultValues as any
  });

  async function onSubmit(data: NewsFormValues) {
    try {
      setLoading(true);

      // Transform tags and categories back to array/json
      // Prepare translations array
      const translations = [];
      if (data.titleTh || data.contentTh || data.summaryTh) {
        translations.push({
          language: 'th',
          title: data.titleTh || '',
          content: data.contentTh || '',
          summary: data.summaryTh || ''
        });
      }

      // Transform tags and categories back to array/json
      const formattedData = {
        ...data,
        id: initialData?.id,
        tags: data.tags
          ? data.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        categories: data.categories
          ? data.categories
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        translations
      };

      const result = await saveNewsAction(formattedData);

      if (result.success) {
        toast.success(
          initialData ? 'News article updated.' : 'News article created.'
        );
        router.push('/dashboard/news-articles');
        router.refresh();
      } else {
        toast.error(result.error || 'Something went wrong.');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit News Article' : 'Create News Article'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            {/* Left Column: Main Content */}
            <div className='space-y-8'>
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <Tabs defaultValue='en' className='w-full'>
                    <TabsList className='grid w-full grid-cols-2'>
                      <TabsTrigger value='en'>English (Default)</TabsTrigger>
                      <TabsTrigger value='th'>Thai</TabsTrigger>
                    </TabsList>

                    {/* English Tab */}
                    <TabsContent value='en' className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title (EN)</FormLabel>
                            <FormControl>
                              <Input
                                disabled={loading}
                                placeholder='News Title'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='summary'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Summary (EN)</FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={loading}
                                placeholder='Brief summary...'
                                className='min-h-[100px]'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='content'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content (EN)</FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={loading}
                                placeholder='Full content (Markdown supported)'
                                className='min-h-[200px] font-mono'
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Markdown is supported.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    {/* Thai Tab */}
                    <TabsContent value='th' className='space-y-4'>
                      <FormField
                        control={form.control}
                        name='titleTh'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title (TH)</FormLabel>
                            <FormControl>
                              <Input
                                disabled={loading}
                                placeholder='Thai News Title'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='summaryTh'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Summary (TH)</FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={loading}
                                placeholder='Thai summary...'
                                className='min-h-[100px]'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='contentTh'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content (TH)</FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={loading}
                                placeholder='Thai content (Markdown supported)'
                                className='min-h-[200px] font-mono'
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Markdown is supported.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Settings & Original Metadata */}
            <div className='space-y-8'>
              <Card>
                <CardHeader>
                  <CardTitle>Metadata</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='symbol'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symbol</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder='e.g. AAPL'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='publisher'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publisher</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder='e.g. Bloomberg'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='language'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language (Original)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select language' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='en'>English</SelectItem>
                            <SelectItem value='th'>Thai</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='publishedDate'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Published Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='imageUrl'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder='https://example.com/image.jpg'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='sourceUrl'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source URL</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder='https://example.com/news/123'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='tags'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder='Comma separated tags'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Separate tags with commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='categories'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder='Comma separated categories'
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Separate categories with commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='isActive'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Active</FormLabel>
                          <FormDescription>
                            Show this news article in the app.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='isFeatured'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Featured</FormLabel>
                          <FormDescription>
                            Highlight this article on the dashboard.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='isHot'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Hot</FormLabel>
                          <FormDescription>
                            Mark this article as trending or hot.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className='flex justify-end gap-4'>
            <Button
              variant='outline'
              type='button'
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {initialData ? 'Update News' : 'Create News'}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
