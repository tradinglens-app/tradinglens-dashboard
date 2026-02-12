'use strict';

import { NewsArticle } from '../services/news.service';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

interface NewsDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsArticle | null;
}

export function NewsDetailSheet({
  isOpen,
  onClose,
  news
}: NewsDetailSheetProps) {
  if (!news) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full p-0 sm:max-w-xl' side='right'>
        <div className='flex h-full flex-col'>
          <SheetHeader className='p-6 pb-2'>
            <div className='flex items-start justify-between gap-4'>
              <SheetTitle className='text-xl leading-tight font-bold'>
                {news.title}
              </SheetTitle>
            </div>
            <div className='mt-2 flex flex-wrap gap-2'>
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
                {news.language || 'Unknown Language'}
              </Badge>
            </div>
            <SheetDescription className='sr-only'>
              Detailed view of the news article
            </SheetDescription>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-6'>
            <div className='space-y-6 pb-6'>
              {/* Image */}
              {news.imageUrl && (
                <div className='relative h-64 w-full overflow-hidden rounded-lg border'>
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className='h-full w-full object-cover'
                  />
                </div>
              )}

              {/* Meta Info */}
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <Building className='h-4 w-4' />
                  <span className='text-foreground font-medium'>Symbol:</span>
                  {news.symbol}
                </div>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <Globe className='h-4 w-4' />
                  <span className='text-foreground font-medium'>
                    Publisher:
                  </span>
                  {news.publisher || 'N/A'}
                </div>
                <div className='text-muted-foreground flex items-center gap-2'>
                  <CalendarDays className='h-4 w-4' />
                  <span className='text-foreground font-medium'>
                    Published:
                  </span>
                  {format(new Date(news.publishedDate), 'PP p')}
                </div>
                {news.exchange && (
                  <div className='text-muted-foreground flex items-center gap-2'>
                    <Building className='h-4 w-4' />
                    <span className='text-foreground font-medium'>
                      Exchange:
                    </span>
                    {news.exchange}
                  </div>
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
                    <span className='text-xs font-medium uppercase'>Views</span>
                  </div>
                  <span className='text-lg font-bold'>
                    {news.viewCount.toLocaleString()}
                  </span>
                </div>
                <div className='flex flex-col items-center gap-1'>
                  <div className='text-muted-foreground flex items-center gap-1.5'>
                    <ThumbsUp className='h-4 w-4' />
                    <span className='text-xs font-medium uppercase'>Likes</span>
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
                <div>
                  <h4 className='mb-2 font-semibold'>Summary</h4>
                  <p className='text-muted-foreground text-sm leading-relaxed'>
                    {news.summary || 'No summary available.'}
                  </p>
                </div>

                {news.content && (
                  <div>
                    <h4 className='mb-2 font-semibold'>Content</h4>
                    <p className='text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap'>
                      {news.content}
                    </p>
                  </div>
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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
