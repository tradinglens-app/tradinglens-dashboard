'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Notification } from '../../services/notifications.service';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDateApp } from '@/lib/format';
import { DateCell } from '@/components/ui/date-cell';
import { toLabel, toOptions } from '@/lib/db-enums.utils';

const typeBadgeColor: Record<string, string> = {
  like: 'bg-pink-100 text-pink-800 hover:bg-pink-100',
  reply: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  mention: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  follow: 'bg-green-100 text-green-800 hover:bg-green-100',
  quote: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  repost: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100',
  system: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  socials: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100',
  breaking_news: 'bg-red-100 text-red-800 hover:bg-red-100',
  thread_poll: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  thread: 'bg-teal-100 text-teal-800 hover:bg-teal-100',
  follow_request: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  follow_request_accepted:
    'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  new_post: 'bg-sky-100 text-sky-800 hover:bg-sky-100',
  new_reply: 'bg-violet-100 text-violet-800 hover:bg-violet-100'
};

export const getColumns = (
  onDetail: (notification: Notification) => void,
  enumValues?: Record<string, string[]>
): ColumnDef<Notification>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='w-[300px] truncate'>{row.getValue('id')}</div>
    ),
    enableColumnFilter: false,
    enableSorting: false
  },

  {
    accessorKey: 'message_en',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Message' />
    ),
    cell: ({ row }) => {
      const message = row.original.message_en || row.original.message_th;
      return (
        <div className='max-w-[300px] truncate' title={message || ''}>
          {message || 'No message'}
        </div>
      );
    },
    enableColumnFilter: false
  },
  {
    id: 'sender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sender' />
    ),
    cell: ({ row }) => {
      const sender = row.original.sender;
      if (!sender) {
        return <span className='text-muted-foreground'>System</span>;
      }
      return (
        <div className='flex items-center gap-2'>
          <Avatar className='h-6 w-6'>
            <AvatarImage src={sender.profile_pic || ''} />
            <AvatarFallback className='text-xs'>
              {(sender.name || 'U').charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className='truncate text-sm'>
            {sender.name || sender.username || 'Unknown'}
          </span>
        </div>
      );
    },
    enableColumnFilter: false,
    enableSorting: false
  },
  {
    accessorKey: 'is_read',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Read' />
    ),
    cell: ({ row }) => {
      const isRead = row.original.is_read;
      return (
        <Badge
          variant={isRead ? 'secondary' : 'default'}
          className={
            isRead
              ? 'bg-green-100 text-green-800 hover:bg-green-100'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
          }
        >
          {isRead ? 'Read' : 'Unread'}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Read Status',
      variant: 'multiSelect',
      options: [
        { label: 'Read', value: 'true' },
        { label: 'Unread', value: 'false' }
      ]
    },
    enableSorting: true
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const type = row.original.type || 'unknown';
      return (
        <Badge
          variant='outline'
          className={typeBadgeColor[type] || 'bg-gray-100 text-gray-800'}
        >
          {toLabel(type)}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'Type',
      variant: 'multiSelect',
      options: enumValues?.type
        ? toOptions(enumValues.type)
        : [
            { label: 'Like', value: 'like' },
            { label: 'Reply', value: 'reply' },
            { label: 'Mention', value: 'mention' },
            { label: 'Follow', value: 'follow' },
            { label: 'System', value: 'system' }
          ]
    },
    enableSorting: true
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      return <DateCell date={row.original.created_at} />;
    },
    enableColumnFilter: true,
    meta: {
      label: 'Created At',
      variant: 'dateRange'
    },
    enableSorting: true
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title='' />,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onDetail(row.original)}
            className='cursor-pointer'
          >
            <Eye className='mr-2 h-4 w-4' />
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];
