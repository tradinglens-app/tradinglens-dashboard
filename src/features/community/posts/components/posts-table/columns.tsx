'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatDateApp } from '@/lib/format';
import { Post } from '../../services/posts.service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash, Copy, Eye } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { PostDetailSheet } from '../post-detail-sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='w-[280px] truncate' title={row.getValue('id')}>
        {row.getValue('id')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: true
  },
  {
    accessorKey: 'content',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Content' />
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className='max-w-[500px] cursor-pointer truncate'
              title={row.getValue('content')}
            >
              {row.getValue('content') || 'No content (Media only)'}
            </div>
          </TooltipTrigger>
          <TooltipContent className='max-w-[500px] break-words'>
            <p>{row.getValue('content') || 'No content (Media only)'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    enableSorting: false,
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
    accessorKey: 'parent_level',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Level' />
    ),
    cell: ({ row }) => (
      <div className='flex w-[40px] items-center justify-center'>
        {row.getValue('parent_level')}
      </div>
    )
  },
  {
    accessorKey: 'visibility',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Visibility' />
    ),
    cell: ({ row }) => {
      const visibility = row.getValue('visibility') as string;
      return (
        <div className='w-[80px]'>
          <Badge variant='outline'>{visibility || 'Start'}</Badge>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      options: [
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
        <div className='w-[80px]'>
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
      options: [
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
    cell: ({ row }) => {
      return (
        <div className='w-[150px] truncate text-xs'>
          {formatDateApp(row.getValue('created_at'))}
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      variant: 'dateRange'
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell post={row.original} />
  }
];

function ActionCell({ post }: { post: Post }) {
  const [showDetailSheet, setShowDetailSheet] = useState(false);

  return (
    <>
      <PostDetailSheet
        open={showDetailSheet}
        onOpenChange={setShowDetailSheet}
        post={post}
      />
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
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(post.id)}
          >
            <Copy className='mr-2 h-4 w-4' /> Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='text-red-600 focus:text-red-600'>
            <Trash className='mr-2 h-4 w-4' /> Delete (Coming Soon)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
