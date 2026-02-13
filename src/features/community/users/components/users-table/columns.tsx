'use client';

import { ColumnDef } from '@tanstack/react-table';
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
  FileText,
  UserCheck,
  Ban,
  AlertCircle
} from 'lucide-react';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

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
      <div className='max-w-[150px] truncate'>{row.getValue('userName')}</div>
    ),
    enableSorting: true
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
    accessorKey: 'lastLogin',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Last Login' />
    ),
    cell: ({ row }) => (
      <div className='whitespace-nowrap'>{row.getValue('lastLogin')}</div>
    ),
    enableSorting: true
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Joined At' />
    ),
    cell: ({ row }) => (
      <div className='whitespace-nowrap'>{row.getValue('date')}</div>
    ),
    enableSorting: true,
    filterFn: 'inNumberRange',
    meta: {
      variant: 'dateRange'
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
              <FileText className='mr-2 h-4 w-4' />
              Detail
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
