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
  Layers
} from 'lucide-react';
import { format } from 'date-fns';
import { DetailSheetHeader } from '@/components/ui/detail-sheet-header';
import { DetailInfoRow } from '@/components/ui/detail-info-row';

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
                <div className='rounded-md border p-4 text-sm'>
                  {post.content || (
                    <span className='text-muted-foreground italic'>
                      No text content (Media only)
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Additional Information (Grid) */}
              <div className='grid gap-4 py-4'>
                <h4 className='text-sm font-semibold'>References</h4>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  {post.start_thread_id && (
                    <DetailInfoRow
                      icon={Hash}
                      label='Start Thread'
                      value={
                        <p className='truncate' title={post.start_thread_id}>
                          {post.start_thread_id}
                        </p>
                      }
                    />
                  )}
                  {post.parent_thread_id && (
                    <DetailInfoRow
                      icon={MessageSquare}
                      label='Parent Thread'
                      value={
                        <p className='truncate' title={post.parent_thread_id}>
                          {post.parent_thread_id}
                        </p>
                      }
                    />
                  )}
                  {post.quoted_thread_id && (
                    <DetailInfoRow
                      icon={MessageSquare}
                      label='Quoted Thread'
                      value={
                        <p className='truncate' title={post.quoted_thread_id}>
                          {post.quoted_thread_id}
                        </p>
                      }
                    />
                  )}
                  {post.poll_id && (
                    <DetailInfoRow
                      icon={BarChart2}
                      label='Poll ID'
                      value={
                        <p className='truncate' title={post.poll_id}>
                          {post.poll_id}
                        </p>
                      }
                    />
                  )}
                  {post.company_info_id && (
                    <DetailInfoRow
                      icon={Building2}
                      label='Company Info'
                      value={
                        <p className='truncate' title={post.company_info_id}>
                          {post.company_info_id}
                        </p>
                      }
                    />
                  )}
                  {post.news_id && (
                    <DetailInfoRow
                      icon={FileText}
                      label='News ID'
                      value={
                        <p className='truncate' title={post.news_id}>
                          {post.news_id}
                        </p>
                      }
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
