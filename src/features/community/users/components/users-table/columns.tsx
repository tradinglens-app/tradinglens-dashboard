'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatDateApp } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { CommunityUser } from '../../services/community-users.service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  ArrowUpDown,
  FileText,
  UserCheck,
  UserX,
  Eye
} from 'lucide-react';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const getColumns = (
  onDetail: (user: CommunityUser) => void,
  onStatusChange: (user: CommunityUser, status: string) => void
): ColumnDef<CommunityUser>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px] font-medium'>{row.getValue('id')}</div>
    ),
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'userName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Full Name' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Avatar className='h-8 w-8'>
          <AvatarImage
            src={row.original.profilePic || ''}
            alt={row.original.userName}
          />
          <AvatarFallback>
            {row.original.userName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='max-w-[150px] truncate'>{row.getValue('userName')}</div>
      </div>
    ),
    enableSorting: true,
    meta: {
      label: 'Full Name',
      placeholder: 'Search name...',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Username' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[120px] truncate'>@{row.getValue('username')}</div>
    ),
    enableSorting: true
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[180px] truncate'>{row.getValue('email')}</div>
    ),
    enableSorting: true
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Verified' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={status === 'Verified' ? 'default' : 'secondary'}
          className={
            status === 'Verified'
              ? 'bg-green-100 text-green-800 hover:bg-green-100'
              : ''
          }
        >
          {status}
        </Badge>
      );
    },
    enableSorting: true
  },

  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Joined At' />
    ),
    cell: ({ row }) => (
      <div className='whitespace-nowrap'>
        {formatDateApp(row.original.created_at)}
      </div>
    ),
    enableSorting: true,

    meta: {
      variant: 'dateRange'
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'accountStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Account' />
    ),
    cell: ({ row }) => {
      const status = (row.getValue('accountStatus') as string) || 'N/A';
      return (
        <Badge
          variant={
            status === 'NORMAL'
              ? 'outline'
              : status === 'BANNED' || status === 'SUSPENDED'
                ? 'destructive'
                : status === 'WARNING' ||
                    status === 'LIMITED' ||
                    status === 'RESTRICTED'
                  ? 'secondary'
                  : 'secondary'
          }
          className={
            status === 'NORMAL'
              ? 'border-green-200 bg-green-100 text-green-800'
              : status === 'WARNING'
                ? 'border-yellow-200 bg-yellow-100 text-yellow-800'
                : status === 'LIMITED' || status === 'RESTRICTED'
                  ? 'border-orange-200 bg-orange-100 text-orange-800'
                  : status === 'UNDER_REVIEW'
                    ? 'border-blue-200 bg-blue-100 text-blue-800'
                    : ''
          }
        >
          {status}
        </Badge>
      );
    },
    enableSorting: true,
    meta: {
      options: [
        { label: 'Normal', value: 'NORMAL' },
        { label: 'Warning', value: 'WARNING' },
        { label: 'Limited', value: 'LIMITED' },
        { label: 'Restricted', value: 'RESTRICTED' },
        { label: 'Suspended', value: 'SUSPENDED' },
        { label: 'Banned', value: 'BANNED' },
        { label: 'Under Review', value: 'UNDER_REVIEW' }
      ]
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      return (
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
              onClick={() => onDetail(user)}
              className='cursor-pointer'
            >
              <Eye className='mr-2 h-4 w-4' />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserCheck className='mr-2 h-4 w-4' />
                Change Status
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => onStatusChange(user, 'NORMAL')}
                >
                  <span className='mr-2 h-2 w-2 rounded-full bg-green-500' />
                  NORMAL
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(user, 'WARNING')}
                >
                  <span className='mr-2 h-2 w-2 rounded-full bg-yellow-500' />
                  WARNING
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(user, 'LIMITED')}
                >
                  <span className='mr-2 h-2 w-2 rounded-full bg-orange-300' />
                  LIMITED
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(user, 'RESTRICTED')}
                >
                  <span className='mr-2 h-2 w-2 rounded-full bg-orange-500' />
                  RESTRICTED
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(user, 'SUSPENDED')}
                >
                  <span className='mr-2 h-2 w-2 rounded-full bg-red-400' />
                  SUSPENDED
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(user, 'BANNED')}
                >
                  <span className='mr-2 h-2 w-2 rounded-full bg-red-600' />
                  BANNED
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(user, 'UNDER_REVIEW')}
                >
                  <span className='mr-2 h-2 w-2 rounded-full bg-blue-400' />
                  UNDER_REVIEW
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
