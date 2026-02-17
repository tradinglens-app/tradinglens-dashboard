'use client';

import { Post } from '../services/posts.service';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  User,
  Hash,
  MessageSquare,
  BarChart2,
  Building2,
  FileText,
  Eye,
  Layers,
  Heart,
  Repeat,
  MessageCircle,
  Share2,
  AtSign
} from 'lucide-react';
import { format } from 'date-fns';
import { DetailSheetHeader } from '@/components/ui/detail-sheet-header';
import { DetailInfoRow } from '@/components/ui/detail-info-row';
import ReactMarkdown from 'react-markdown';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface PostDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
}

export function PostDetailSheet({
  open,
  onOpenChange,
  post
}: PostDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full p-0 sm:max-w-xl' side='right'>
        <div className='flex h-full flex-col'>
          <DetailSheetHeader
            avatar={{
              src: post.user?.profile_pic || null,
              fallback: post.user?.name?.charAt(0)?.toUpperCase() || 'U'
            }}
            title={post.user?.name || 'Unknown User'}
            subtitle={`@${post.user?.username || 'unknown'}`}
            badges={
              <>
                <Badge variant='secondary' className='font-normal'>
                  {post.visibility || 'Public'}
                </Badge>
                {post.parent_level !== undefined && (
                  <Badge variant='outline' className='font-normal'>
                    Level {post.parent_level}
                  </Badge>
                )}
                <Badge variant='outline'>ID: {post.id.slice(0, 8)}...</Badge>
              </>
            }
            description='Detailed view of the post'
          />

          <div className='flex-1 overflow-y-auto px-6'>
            <div className='space-y-6 pb-6'>
              {/* Primary Info */}
              <div className='grid gap-4 py-4'>
                <DetailInfoRow
                  icon={User}
                  label='Username'
                  value={`@${post.user?.username || '-'}`}
                />

                <DetailInfoRow
                  icon={Calendar}
                  label='Created At'
                  value={format(new Date(post.created_at), 'PPP p')}
                />

                <DetailInfoRow
                  icon={Clock}
                  label='Last Updated'
                  value={
                    post.updated_at
                      ? format(new Date(post.updated_at), 'PPP p')
                      : 'N/A'
                  }
                />

                <DetailInfoRow
                  icon={Eye}
                  label='Visibility'
                  value={
                    <span className='capitalize'>
                      {post.visibility || 'Public'}
                    </span>
                  }
                />

                <DetailInfoRow
                  icon={Layers}
                  label='Type'
                  value={
                    <div className='flex items-center gap-2'>
                      {(() => {
                        let type = 'Default';
                        let className = '';

                        if (post.poll_id) {
                          type = 'Poll';
                          className =
                            'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800';
                        } else if (post.company_info_id) {
                          type = 'Company Info';
                          className =
                            'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800';
                        } else if (post.quoted_thread_id) {
                          type = 'Quote';
                          className =
                            'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800';
                        } else if (post.news_id) {
                          type = 'News';
                          className =
                            'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800';
                        } else {
                          className =
                            'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
                        }

                        return <Badge className={className}>{type}</Badge>;
                      })()}
                    </div>
                  }
                />

                {post.parent_level !== undefined && (
                  <DetailInfoRow
                    icon={Layers}
                    label='Parent Level'
                    value={post.parent_level.toString()}
                  />
                )}
              </div>

              <Separator />

              {/* Content Section */}
              <div className='grid gap-4 py-4'>
                <h4 className='text-sm font-semibold'>Content</h4>
                <div className='bg-muted/50 rounded-md border p-4 text-sm'>
                  {post.content ? (
                    <div className='prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap'>
                      <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <span className='text-muted-foreground italic'>
                      No text content (Media only)
                    </span>
                  )}
                </div>
              </div>

              {/* Engagement Metrics Section */}
              {post.metrics && (
                <>
                  <Separator />
                  <div className='grid gap-4 py-4'>
                    <h4 className='text-sm font-semibold'>Engagement</h4>
                    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                      <div className='bg-muted/30 flex flex-col items-center justify-center rounded-lg border p-3 text-center'>
                        <Eye className='text-muted-foreground mb-1 size-4' />
                        <span className='text-sm font-semibold'>
                          {post.metrics.viewed_count.toLocaleString()}
                        </span>
                        <span className='text-muted-foreground text-[10px] uppercase'>
                          Views
                        </span>
                      </div>
                      <div className='bg-muted/30 flex flex-col items-center justify-center rounded-lg border p-3 text-center'>
                        <Heart className='mb-1 size-4 text-rose-500' />
                        <span className='text-sm font-semibold'>
                          {post.metrics.liked_count.toLocaleString()}
                        </span>
                        <span className='text-muted-foreground text-[10px] uppercase'>
                          Likes
                        </span>
                      </div>
                      <div className='bg-muted/30 flex flex-col items-center justify-center rounded-lg border p-3 text-center'>
                        <MessageCircle className='mb-1 size-4 text-blue-500' />
                        <span className='text-sm font-semibold'>
                          {post.metrics.replied_count.toLocaleString()}
                        </span>
                        <span className='text-muted-foreground text-[10px] uppercase'>
                          Replies
                        </span>
                      </div>
                      <div className='bg-muted/30 flex flex-col items-center justify-center rounded-lg border p-3 text-center'>
                        <Repeat className='mb-1 size-4 text-emerald-500' />
                        <span className='text-sm font-semibold'>
                          {post.metrics.reposted_count.toLocaleString()}
                        </span>
                        <span className='text-muted-foreground text-[10px] uppercase'>
                          Reposts
                        </span>
                      </div>
                      <div className='bg-muted/30 flex flex-col items-center justify-center rounded-lg border p-3 text-center'>
                        <Share2 className='mb-1 size-4 text-purple-500' />
                        <span className='text-sm font-semibold'>
                          {post.metrics.quoted_count.toLocaleString()}
                        </span>
                        <span className='text-muted-foreground text-[10px] uppercase'>
                          Quotes
                        </span>
                      </div>
                      <div className='bg-muted/30 flex flex-col items-center justify-center rounded-lg border p-3 text-center'>
                        <Badge
                          variant='outline'
                          className='mb-1 h-4 border-rose-200 px-1 text-[8px] text-rose-600'
                        >
                          Reported
                        </Badge>
                        <span className='text-sm font-semibold text-rose-600'>
                          {post.metrics.reported_count.toLocaleString()}
                        </span>
                        <span className='text-muted-foreground text-[10px] uppercase'>
                          Reports
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Poll Section */}
              {post.poll && (
                <>
                  <Separator />
                  <div className='grid gap-4 py-4'>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-sm font-semibold'>Poll</h4>
                      {post.poll.expires_at && (
                        <span className='text-muted-foreground text-xs'>
                          Expires:{' '}
                          {format(new Date(post.poll.expires_at), 'PPP')}
                        </span>
                      )}
                    </div>
                    <div className='bg-muted/30 rounded-md border p-4'>
                      <p className='mb-4 font-medium'>{post.poll.question}</p>
                      <div className='space-y-4'>
                        {post.poll.options.map((option) => {
                          const percentage =
                            post.poll!.total_voted > 0
                              ? (option.voted_count / post.poll!.total_voted) *
                                100
                              : 0;
                          return (
                            <div key={option.id} className='space-y-1.5'>
                              <div className='flex items-center justify-between text-xs'>
                                <span>{option.option_text}</span>
                                <span className='text-muted-foreground'>
                                  {option.voted_count} votes (
                                  {percentage.toFixed(1)}
                                  %)
                                </span>
                              </div>
                              <Progress value={percentage} className='h-2' />
                            </div>
                          );
                        })}
                      </div>
                      <p className='text-muted-foreground mt-4 text-xs'>
                        Total: {post.poll.total_voted} votes
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Tags & Mentions Section */}
              {((post.hashtags && post.hashtags.length > 0) ||
                (post.symbols && post.symbols.length > 0) ||
                (post.mentions && post.mentions.length > 0)) && (
                <>
                  <Separator />
                  <div className='grid gap-4 py-4'>
                    <h4 className='text-sm font-semibold'>Metadata</h4>
                    <div className='space-y-4'>
                      {(post.hashtags?.length || 0) > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {post.hashtags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant='secondary'
                              className='bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400'
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {(post.symbols?.length || 0) > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {post.symbols?.map((symbol) => (
                            <Badge
                              key={symbol}
                              variant='secondary'
                              className='bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400'
                            >
                              ${symbol}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {(post.mentions?.length || 0) > 0 && (
                        <div className='grid grid-cols-2 gap-2'>
                          {post.mentions?.map((mention) => (
                            <div
                              key={mention.user_id}
                              className='bg-muted/30 flex items-center gap-2 rounded-md border p-2 text-xs'
                            >
                              <AtSign className='text-muted-foreground size-3' />
                              <span className='font-medium'>
                                {mention.username}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {/* Company Info Section */}
              {post.companyInfo && (
                <>
                  <Separator />
                  <div className='grid gap-4 py-4'>
                    <div className='flex items-center justify-between'>
                      <h4 className='text-sm font-semibold'>Market Data</h4>
                      <Badge className='border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400'>
                        {post.companyInfo.symbol}
                      </Badge>
                    </div>
                    <div className='bg-muted/10 space-y-3 rounded-md border p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-muted-foreground text-xs'>
                            Asset Name
                          </p>
                          <p className='font-semibold'>
                            {post.companyInfo.name}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-muted-foreground bg-muted/30 inline-block rounded px-1 text-[10px] uppercase'>
                            {post.companyInfo.market_state}
                          </p>
                          <p className='mt-1 text-xl font-bold'>
                            {post.companyInfo.regular_market_price.toLocaleString(
                              undefined,
                              {
                                style: 'currency',
                                currency: post.companyInfo.currency
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4 border-t pt-3'>
                        <div>
                          <p className='text-muted-foreground text-[10px] font-medium uppercase'>
                            Change
                          </p>
                          <p
                            className={cn(
                              'text-sm font-bold',
                              post.companyInfo.regular_market_change >= 0
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            )}
                          >
                            {post.companyInfo.regular_market_change >= 0
                              ? '+'
                              : ''}
                            {post.companyInfo.regular_market_change.toFixed(2)}{' '}
                            (
                            {post.companyInfo.regular_market_change_percent.toFixed(
                              2
                            )}
                            %)
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-muted-foreground text-[10px] font-medium uppercase'>
                            Exchange
                          </p>
                          <p className='text-sm font-medium'>
                            {post.companyInfo.exchange_name || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className='grid grid-cols-2 gap-4 pt-1'>
                        <div>
                          <p className='text-muted-foreground text-[10px] font-medium uppercase'>
                            Sector
                          </p>
                          <p className='text-xs'>{post.companyInfo.sector}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-muted-foreground text-[10px] font-medium uppercase'>
                            Industry
                          </p>
                          <p className='text-xs'>{post.companyInfo.industry}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Media Section */}
              {post.media && post.media.length > 0 && (
                <>
                  <Separator />
                  <div className='grid gap-4 py-4'>
                    <h4 className='text-sm font-semibold'>
                      Media ({post.media.length})
                    </h4>
                    <div className='grid grid-cols-2 gap-4'>
                      {post.media.map((item) => (
                        <div
                          key={item.id}
                          className='bg-muted relative aspect-square overflow-hidden rounded-md border'
                        >
                          {item.media_type?.startsWith('video') ? (
                            <video
                              src={item.media_url || ''}
                              className='h-full w-full object-cover'
                              controls
                            />
                          ) : (
                            <img
                              src={item.media_url || item.thumbnail_url || ''}
                              alt='Post media'
                              className='h-full w-full cursor-pointer object-cover transition-transform hover:scale-105'
                              onClick={() =>
                                window.open(item.media_url || '', '_blank')
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Additional Information (Grid) */}
              <div className='grid gap-4 py-4'>
                <h4 className='text-sm font-semibold'>References</h4>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  {post.start_thread_id && (
                    <DetailInfoRow
                      icon={Hash}
                      label='Start Thread'
                      value={<p className='truncate'>{post.start_thread_id}</p>}
                    />
                  )}
                  {post.parent_thread_id && (
                    <DetailInfoRow
                      icon={MessageSquare}
                      label='Parent Thread'
                      value={
                        <p className='truncate'>{post.parent_thread_id}</p>
                      }
                    />
                  )}
                  {post.quoted_thread_id && (
                    <DetailInfoRow
                      icon={MessageSquare}
                      label='Quoted Thread'
                      value={
                        <p className='truncate'>{post.quoted_thread_id}</p>
                      }
                    />
                  )}
                  {post.poll_id && (
                    <DetailInfoRow
                      icon={BarChart2}
                      label='Poll ID'
                      value={<p className='truncate'>{post.poll_id}</p>}
                    />
                  )}
                  {post.company_info_id && (
                    <DetailInfoRow
                      icon={Building2}
                      label='Company Info'
                      value={<p className='truncate'>{post.company_info_id}</p>}
                    />
                  )}
                  {post.news_id && (
                    <DetailInfoRow
                      icon={FileText}
                      label='News ID'
                      value={<p className='truncate'>{post.news_id}</p>}
                    />
                  )}
                </div>
              </div>

              <Separator />

              {/* System IDs */}
              <div className='grid gap-4 py-4'>
                <h4 className='text-sm font-semibold'>System IDs</h4>
                <div className='text-muted-foreground space-y-2 text-xs break-all'>
                  <p>Post ID: {post.id}</p>
                  <p>User ID: {post.user_id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
