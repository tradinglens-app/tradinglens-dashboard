'use client';

import { Post } from '../services/posts.service';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
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
          <SheetHeader className='p-6 pb-2'>
            <div className='flex items-start gap-4'>
              <Avatar className='h-12 w-12 flex-shrink-0'>
                <AvatarImage
                  src={post.user?.profile_pic || ''}
                  alt={post.user?.name || 'User'}
                />
                <AvatarFallback>
                  {post.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <SheetTitle className='text-xl leading-tight font-bold'>
                  {post.user?.name || 'Unknown User'}
                </SheetTitle>
                <p className='text-muted-foreground mt-1 text-sm'>
                  @{post.user?.username || 'unknown'}
                </p>
              </div>
            </div>
            <div className='mt-2 flex flex-wrap gap-2'>
              <Badge variant='secondary' className='font-normal'>
                {post.visibility || 'Public'}
              </Badge>
              {post.parent_level !== undefined && (
                <Badge variant='outline' className='font-normal'>
                  Level {post.parent_level}
                </Badge>
              )}
              <Badge variant='outline'>ID: {post.id.slice(0, 8)}...</Badge>
            </div>
            <SheetDescription className='sr-only'>
              Detailed view of the post
            </SheetDescription>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-6'>
            <div className='space-y-6 pb-6'>
              {/* Primary Info */}
              <div className='grid gap-4 py-4'>
                <div className='flex items-center gap-3'>
                  <User className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>Username</p>
                    <p className='text-muted-foreground text-sm'>
                      @{post.user?.username || '-'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Calendar className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      Created At
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {format(new Date(post.created_at), 'PPP p')}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Clock className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      Last Updated
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {post.updated_at
                        ? format(new Date(post.updated_at), 'PPP p')
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Eye className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      Visibility
                    </p>
                    <p className='text-muted-foreground text-sm capitalize'>
                      {post.visibility || 'Public'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Layers className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>Type</p>
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
                  </div>
                </div>

                {post.parent_level !== undefined && (
                  <div className='flex items-center gap-3'>
                    <Layers className='text-muted-foreground h-5 w-5' />
                    <div className='space-y-1'>
                      <p className='text-sm leading-none font-medium'>
                        Parent Level
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {post.parent_level}
                      </p>
                    </div>
                  </div>
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
                    <div>
                      <span className='text-muted-foreground flex items-center gap-2'>
                        <Hash className='h-3 w-3' /> Start Thread
                      </span>
                      <p
                        className='truncate font-medium'
                        title={post.start_thread_id}
                      >
                        {post.start_thread_id}
                      </p>
                    </div>
                  )}
                  {post.parent_thread_id && (
                    <div>
                      <span className='text-muted-foreground flex items-center gap-2'>
                        <MessageSquare className='h-3 w-3' /> Parent Thread
                      </span>
                      <p
                        className='truncate font-medium'
                        title={post.parent_thread_id}
                      >
                        {post.parent_thread_id}
                      </p>
                    </div>
                  )}
                  {post.quoted_thread_id && (
                    <div>
                      <span className='text-muted-foreground flex items-center gap-2'>
                        <MessageSquare className='h-3 w-3' /> Quoted Thread
                      </span>
                      <p
                        className='truncate font-medium'
                        title={post.quoted_thread_id}
                      >
                        {post.quoted_thread_id}
                      </p>
                    </div>
                  )}
                  {post.poll_id && (
                    <div>
                      <span className='text-muted-foreground flex items-center gap-2'>
                        <BarChart2 className='h-3 w-3' /> Poll ID
                      </span>
                      <p className='truncate font-medium' title={post.poll_id}>
                        {post.poll_id}
                      </p>
                    </div>
                  )}
                  {post.company_info_id && (
                    <div>
                      <span className='text-muted-foreground flex items-center gap-2'>
                        <Building2 className='h-3 w-3' /> Company Info
                      </span>
                      <p
                        className='truncate font-medium'
                        title={post.company_info_id}
                      >
                        {post.company_info_id}
                      </p>
                    </div>
                  )}
                  {post.news_id && (
                    <div>
                      <span className='text-muted-foreground flex items-center gap-2'>
                        <FileText className='h-3 w-3' /> News ID
                      </span>
                      <p className='truncate font-medium' title={post.news_id}>
                        {post.news_id}
                      </p>
                    </div>
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
