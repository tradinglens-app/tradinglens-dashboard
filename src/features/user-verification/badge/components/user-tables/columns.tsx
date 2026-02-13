'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatDateApp } from '@/lib/format';
import { VerificationRequest } from '../../services/user.service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Eye, MoreHorizontal } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const getColumns = (
  onDetail: (user: VerificationRequest) => void,
  onVerify: (user: VerificationRequest) => void,
  onRevoke: (user: VerificationRequest) => void
): ColumnDef<VerificationRequest>[] => [
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
    enableSorting: true,
    enableColumnFilter: true
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[180px] truncate'>{row.getValue('email')}</div>
    ),
    enableSorting: true,
    meta: {
      label: 'Email',
      placeholder: 'Search email...',
      variant: 'text'
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'Verified'
              ? 'default'
              : status === 'Pending'
                ? 'secondary'
                : 'outline'
          }
          className={
            status === 'Verified'
              ? 'bg-green-100 text-green-800 hover:bg-green-100'
              : status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
          }
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      label: 'Status',
      variant: 'multiSelect',
      options: [
        { label: 'Verified', value: 'Verified' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Unverified', value: 'Unverified' }
      ]
    },
    enableColumnFilter: true
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
            {user.status !== 'Verified' && (
              <DropdownMenuItem
                onClick={() => onVerify(user)}
                className='cursor-pointer text-green-600 focus:text-green-600'
              >
                <Icons.userCheck className='mr-2 h-4 w-4' />
                Grant Verify
              </DropdownMenuItem>
            )}
            {user.status === 'Verified' && (
              <DropdownMenuItem
                onClick={() => onRevoke(user)}
                className='cursor-pointer text-red-600 focus:text-red-600'
              >
                <Icons.userX className='mr-2 h-4 w-4' />
                Revoke Verify
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
