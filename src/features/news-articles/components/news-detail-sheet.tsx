'use strict';

import * as React from 'react';
import { NewsArticle } from '../services/news.service';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import {
  CalendarDays,
  Globe,
  Languages,
  Link as LinkIcon,
  MessageCircle,
  Share2,
  ThumbsUp,
  Eye,
  Building
} from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { DetailSheetHeader } from '@/components/ui/detail-sheet-header';
import { DetailInfoRow } from '@/components/ui/detail-info-row';
import { DetailContentBox } from '@/components/ui/detail-content-box';

interface NewsDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsArticle | null;
}

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const NewsDetailImage = ({
  imageUrl,
  title
}: {
  imageUrl: string;
  title: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error || !imageUrl || !isValidUrl(imageUrl)) {
    return (
      <div className='bg-muted flex h-64 w-full items-center justify-center rounded-lg border'>
        <Building className='text-muted-foreground h-16 w-16' />
      </div>
    );
  }

  return (
    <div className='relative h-64 w-full overflow-hidden rounded-lg border'>
      {isLoading && <Skeleton className='absolute inset-0 h-full w-full' />}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        sizes='(max-width: 768px) 100vw, 600px'
        priority
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export function NewsDetailSheet({
  isOpen,
  onClose,
  news
}: NewsDetailSheetProps) {
  const [activeTab, setActiveTab] = useState('original');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset tab when news changes or sheet opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('original');
    }
  }, [isOpen, news]);

  if (!isMounted || !news) return null;

  const thaiTranslation = news.translations?.find((t) => t.language === 'th');

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full p-0 sm:max-w-xl' side='right'>
        <div className='flex h-full flex-col'>
          <DetailSheetHeader
            title={
              activeTab === 'thai' && thaiTranslation
                ? thaiTranslation.title
                : news.title
            }
            badges={
              <>
                <Badge variant={news.isActive ? 'default' : 'secondary'}>
                  {news.isActive ? 'Active' : 'Hidden'}
                </Badge>
                {news.isFeatured && (
                  <Badge
                    variant='outline'
                    className='border-yellow-500 bg-yellow-50 text-yellow-600'
                  >
                    Featured
                  </Badge>
                )}
                {news.isHot && (
                  <Badge
                    variant='outline'
                    className='border-red-500 bg-red-50 text-red-600'
                  >
                    Hot
                  </Badge>
                )}
                <Badge variant='outline' className='capitalize'>
                  {activeTab === 'thai'
                    ? 'Thai'
                    : news.language || 'Unknown Language'}
                </Badge>
                {thaiTranslation && (
                  <Badge
                    variant='outline'
                    className='border-blue-500 text-blue-600'
                  >
                    TH Available
                  </Badge>
                )}
              </>
            }
            description='Detailed view of the news article'
          />

          <div className='flex-1 overflow-y-auto px-6'>
            {thaiTranslation ? (
              <Tabs
                defaultValue='original'
                value={activeTab}
                onValueChange={setActiveTab}
                className='w-full'
              >
                <div className='py-4'>
                  <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='original'>
                      Original ({news.language || 'EN'})
                    </TabsTrigger>
                    <TabsTrigger value='thai'>Thai (TH)</TabsTrigger>
                  </TabsList>
                </div>

                <div className='space-y-6 pb-6'>
                  {/* Image */}
                  {news.imageUrl && (
                    <NewsDetailImage
                      imageUrl={news.imageUrl}
                      title={news.title}
                    />
                  )}

                  {/* Meta Info */}
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <DetailInfoRow
                      icon={Building}
                      label='Symbol'
                      value={news.symbol}
                    />
                    <DetailInfoRow
                      icon={Globe}
                      label='Publisher'
                      value={news.publisher || 'N/A'}
                    />
                    <DetailInfoRow
                      icon={CalendarDays}
                      label='Published'
                      value={format(new Date(news.publishedDate), 'PP p')}
                    />
                    {news.exchange && (
                      <DetailInfoRow
                        icon={Building}
                        label='Exchange'
                        value={news.exchange}
                      />
                    )}
                  </div>

                  <Separator />

                  {/* Tags & Categories */}
                  {(news.tags.length > 0 || news.categories) && (
                    <>
                      <div className='bg-muted/30 rounded-lg border border-dashed p-3'>
                        <div className='flex flex-wrap gap-x-6 gap-y-2'>
                          {news.tags.length > 0 && (
                            <div className='flex items-center gap-2'>
                              <span className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                                Tags:
                              </span>
                              <div className='flex flex-wrap gap-1.5'>
                                {news.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant='secondary'
                                    className='hover:bg-secondary/80 h-5 px-2 text-[10px]'
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {news.categories &&
                            Array.isArray(news.categories) &&
                            news.categories.length > 0 && (
                              <div className='flex items-center gap-2'>
                                <span className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                                  Cats:
                                </span>
                                <div className='flex flex-wrap gap-1.5'>
                                  {news.categories.map(
                                    (cat: any, index: number) => (
                                      <Badge
                                        key={index}
                                        variant='outline'
                                        className='bg-background h-5 px-2 text-[10px]'
                                      >
                                        {typeof cat === 'string'
                                          ? cat
                                          : JSON.stringify(cat)}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      <Separator />
                    </>
                  )}

                  {/* Statistics */}
                  <div className='bg-muted/50 flex justify-around rounded-lg py-2'>
                    <div className='flex flex-col items-center gap-1'>
                      <div className='text-muted-foreground flex items-center gap-1.5'>
                        <Eye className='h-4 w-4' />
                        <span className='text-xs font-medium uppercase'>
                          Views
                        </span>
                      </div>
                      <span className='text-lg font-bold'>
                        {news.viewCount.toLocaleString()}
                      </span>
                    </div>
                    <div className='flex flex-col items-center gap-1'>
                      <div className='text-muted-foreground flex items-center gap-1.5'>
                        <ThumbsUp className='h-4 w-4' />
                        <span className='text-xs font-medium uppercase'>
                          Likes
                        </span>
                      </div>
                      <span className='text-lg font-bold'>
                        {news.likeCount.toLocaleString()}
                      </span>
                    </div>
                    <div className='flex flex-col items-center gap-1'>
                      <div className='text-muted-foreground flex items-center gap-1.5'>
                        <Share2 className='h-4 w-4' />
                        <span className='text-xs font-medium uppercase'>
                          Shares
                        </span>
                      </div>
                      <span className='text-lg font-bold'>
                        {news.shareCount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <TabsContent value='original' className='mt-0 space-y-4'>
                    <DetailContentBox
                      label='Summary'
                      content={
                        <ReactMarkdown>
                          {news.summary || 'No summary available.'}
                        </ReactMarkdown>
                      }
                    />

                    {news.content && (
                      <DetailContentBox
                        label='Content'
                        content={<ReactMarkdown>{news.content}</ReactMarkdown>}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value='thai' className='mt-0 space-y-4'>
                    {/* Title is displayed in Header now */}
                    <DetailContentBox
                      label='Summary (TH)'
                      content={
                        <ReactMarkdown>
                          {thaiTranslation.summary ||
                            'No Thai summary available.'}
                        </ReactMarkdown>
                      }
                    />

                    {thaiTranslation.content && (
                      <DetailContentBox
                        label='Content (TH)'
                        content={
                          <ReactMarkdown>
                            {thaiTranslation.content}
                          </ReactMarkdown>
                        }
                      />
                    )}
                  </TabsContent>

                  {/* Source Link */}
                  {news.sourceUrl && (
                    <>
                      <Separator />
                      <div className='pt-2'>
                        <a
                          href={news.sourceUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary flex items-center gap-2 text-sm font-medium hover:underline'
                        >
                          <LinkIcon className='h-4 w-4' />
                          View Original Source
                        </a>
                      </div>
                    </>
                  )}

                  <div className='text-muted-foreground pt-4 text-right text-xs'>
                    Created:{' '}
                    {format(new Date(news.createdAt || new Date()), 'PP pp')}
                    {news.updatedAt && (
                      <>
                        {' '}
                        • Updated: {format(new Date(news.updatedAt), 'PP pp')}
                      </>
                    )}
                  </div>
                </div>
              </Tabs>
            ) : (
              <div className='space-y-6 pt-6 pb-6'>
                {/* Image */}
                {news.imageUrl && (
                  <NewsDetailImage
                    imageUrl={news.imageUrl}
                    title={news.title}
                  />
                )}

                {/* Meta Info */}
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <DetailInfoRow
                    icon={Building}
                    label='Symbol'
                    value={news.symbol}
                  />
                  <DetailInfoRow
                    icon={Globe}
                    label='Publisher'
                    value={news.publisher || 'N/A'}
                  />
                  <DetailInfoRow
                    icon={CalendarDays}
                    label='Published'
                    value={format(new Date(news.publishedDate), 'PP p')}
                  />
                  {news.exchange && (
                    <DetailInfoRow
                      icon={Building}
                      label='Exchange'
                      value={news.exchange}
                    />
                  )}
                </div>

                <Separator />

                {/* Tags & Categories */}
                {(news.tags.length > 0 || news.categories) && (
                  <>
                    <div className='bg-muted/30 rounded-lg border border-dashed p-3'>
                      <div className='flex flex-wrap gap-x-6 gap-y-2'>
                        {news.tags.length > 0 && (
                          <div className='flex items-center gap-2'>
                            <span className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                              Tags:
                            </span>
                            <div className='flex flex-wrap gap-1.5'>
                              {news.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant='secondary'
                                  className='hover:bg-secondary/80 h-5 px-2 text-[10px]'
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {news.categories &&
                          Array.isArray(news.categories) &&
                          news.categories.length > 0 && (
                            <div className='flex items-center gap-2'>
                              <span className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                                Cats:
                              </span>
                              <div className='flex flex-wrap gap-1.5'>
                                {news.categories.map(
                                  (cat: any, index: number) => (
                                    <Badge
                                      key={index}
                                      variant='outline'
                                      className='bg-background h-5 px-2 text-[10px]'
                                    >
                                      {typeof cat === 'string'
                                        ? cat
                                        : JSON.stringify(cat)}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    <Separator />
                  </>
                )}

                {/* Statistics */}
                <div className='bg-muted/50 flex justify-around rounded-lg py-2'>
                  <div className='flex flex-col items-center gap-1'>
                    <div className='text-muted-foreground flex items-center gap-1.5'>
                      <Eye className='h-4 w-4' />
                      <span className='text-xs font-medium uppercase'>
                        Views
                      </span>
                    </div>
                    <span className='text-lg font-bold'>
                      {news.viewCount.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex flex-col items-center gap-1'>
                    <div className='text-muted-foreground flex items-center gap-1.5'>
                      <ThumbsUp className='h-4 w-4' />
                      <span className='text-xs font-medium uppercase'>
                        Likes
                      </span>
                    </div>
                    <span className='text-lg font-bold'>
                      {news.likeCount.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex flex-col items-center gap-1'>
                    <div className='text-muted-foreground flex items-center gap-1.5'>
                      <Share2 className='h-4 w-4' />
                      <span className='text-xs font-medium uppercase'>
                        Shares
                      </span>
                    </div>
                    <span className='text-lg font-bold'>
                      {news.shareCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Content */}
                <div className='space-y-4'>
                  <DetailContentBox
                    label='Summary'
                    content={
                      <ReactMarkdown>
                        {news.summary || 'No summary available.'}
                      </ReactMarkdown>
                    }
                  />

                  {news.content && (
                    <DetailContentBox
                      label='Content'
                      content={<ReactMarkdown>{news.content}</ReactMarkdown>}
                    />
                  )}
                </div>

                {/* Source Link */}
                {news.sourceUrl && (
                  <>
                    <Separator />
                    <div className='pt-2'>
                      <a
                        href={news.sourceUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary flex items-center gap-2 text-sm font-medium hover:underline'
                      >
                        <LinkIcon className='h-4 w-4' />
                        View Original Source
                      </a>
                    </div>
                  </>
                )}

                <div className='text-muted-foreground pt-4 text-right text-xs'>
                  Created:{' '}
                  {format(new Date(news.createdAt || new Date()), 'PP pp')}
                  {news.updatedAt && (
                    <> • Updated: {format(new Date(news.updatedAt), 'PP pp')}</>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
