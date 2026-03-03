'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DateCell } from '@/components/ui/date-cell';
import { Post } from '../../services/posts.service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash, Copy, Eye, Pencil } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useTransition } from 'react';
import { PostDetailSheet } from '../post-detail-sheet';
import { BotPostEditSheet } from '../bot-post-edit-sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import ReactMarkdown from 'react-markdown';
import { toOptions } from '@/lib/db-enums.utils';
import { deleteBotPostAction } from '../../actions/bot-posts-actions';
import { toast } from 'sonner';

export const getBotPostColumns = (
  enumValues?: Record<string, string[]>
): ColumnDef<Post>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='truncate' title={row.getValue('id')}>
        {row.getValue('id')}
      </div>
    ),
    size: 280,
    enableSorting: true,
    enableHiding: false,
    enableColumnFilter: true
  },
  {
    accessorKey: 'content',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Content' />
    ),
    cell: ({ row }) => {
      const content = (row.getValue('content') as string) || '';
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='max-w-[300px] cursor-pointer truncate'>
              {content || '-'}
            </div>
          </TooltipTrigger>
          <TooltipContent className='max-w-[450px] leading-relaxed whitespace-pre-wrap shadow-md'>
            <div className='prose prose-sm dark:prose-invert'>
              <ReactMarkdown>{content || '-'}</ReactMarkdown>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
    enableSorting: true,
    enableHiding: false,
    enableColumnFilter: true
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Author' />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className='flex items-center gap-2'>
          <Avatar className='h-8 w-8 flex-shrink-0'>
            <AvatarImage
              src={user?.profile_pic || ''}
              alt={user?.name || 'User'}
            />
            <AvatarFallback className='text-xs'>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className='flex min-w-0 flex-col'>
            <span className='truncate font-medium'>
              {user?.name || 'Unknown'}
            </span>
            <span className='text-muted-foreground truncate text-xs'>
              @{user?.username || 'unknown'}
            </span>
          </div>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'visibility',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Visibility' />
    ),
    cell: ({ row }) => {
      const visibility = row.getValue('visibility') as string;
      return (
        <div>
          <Badge variant='outline'>{visibility || 'public'}</Badge>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      options: enumValues?.visibility
        ? toOptions(enumValues.visibility)
        : [
            { label: 'Public', value: 'public' },
            { label: 'Private', value: 'private' },
            { label: 'Followers Only', value: 'followers_only' },
            { label: 'Following Only', value: 'following_only' },
            {
              label: 'Followers & Following',
              value: 'followers_and_following_only'
            }
          ]
    }
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      const typeColors: Record<string, string> = {
        poll: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80',
        company_info: 'bg-orange-100 text-orange-800 hover:bg-orange-100/80',
        quote: 'bg-purple-100 text-purple-800 hover:bg-purple-100/80',
        news: 'bg-green-100 text-green-800 hover:bg-green-100/80',
        default: 'bg-gray-100 text-gray-800 hover:bg-gray-100/80'
      };
      return (
        <div>
          <Badge
            variant='secondary'
            className={`capitalize ${typeColors[type] || typeColors.default}`}
          >
            {type?.replace('_', ' ') || 'Default'}
          </Badge>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      options: enumValues?.type
        ? toOptions(enumValues.type)
        : [
            { label: 'Default', value: 'default' },
            { label: 'Poll', value: 'poll' },
            { label: 'Company Info', value: 'company_info' },
            { label: 'Quote', value: 'quote' },
            { label: 'News', value: 'news' }
          ]
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => (
      <DateCell date={row.getValue('created_at')} className='text-xs' />
    ),
    size: 150,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      variant: 'dateRange'
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <BotActionCell post={row.original} enumValues={enumValues} />
    )
  }
];

function BotActionCell({
  post,
  enumValues
}: {
  post: Post;
  enumValues?: Record<string, string[]>;
}) {
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const confirmDelete = () => {
    startTransition(async () => {
      const result = await deleteBotPostAction(post.id);
      if (result.success) {
        toast.success('Post deleted successfully');
      } else {
        toast.error(result.error ?? 'Failed to delete post');
      }
    });
  };

  return (
    <>
      <PostDetailSheet
        open={showDetailSheet}
        onOpenChange={setShowDetailSheet}
        post={post}
      />
      <BotPostEditSheet
        open={showEditSheet}
        onOpenChange={setShowEditSheet}
        post={post}
        enumValues={enumValues}
      />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              post from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isPending}
              className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowDetailSheet(true)}>
            <Eye className='mr-2 h-4 w-4' /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditSheet(true)}>
            <Pencil className='mr-2 h-4 w-4' /> Edit Post
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(post.id)}
          >
            <Copy className='mr-2 h-4 w-4' /> Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='text-red-600 focus:text-red-600'
            onClick={() => setShowDeleteDialog(true)}
            disabled={isPending}
          >
            <Trash className='mr-2 h-4 w-4' />{' '}
            {isPending ? 'Deleting...' : 'Delete'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
