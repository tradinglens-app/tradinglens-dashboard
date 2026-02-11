'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { VerificationRequest } from '../../services/user.service';
import { VerificationActions } from '../verification-actions';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

export const columns: ColumnDef<VerificationRequest>[] = [
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
    enableSorting: true,
    meta: {
      label: 'Email',
      placeholder: 'Search email...',
      variant: 'text'
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
              : status === 'Rejected'
                ? 'destructive'
                : 'secondary'
          }
          className={
            status === 'Verified'
              ? 'bg-green-100 text-green-800 hover:bg-green-100'
              : status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                : ''
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
        { label: 'Pending', value: 'Pending' }
      ]
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'accountStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Account' />
    ),
    cell: ({ row }) => <div>{row.getValue('accountStatus') || 'N/A'}</div>,
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
    enableSorting: true
  },
  {
    id: 'actions',
    header: () => <div className='text-right'>Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className='text-right'>
          <VerificationActions
            userId={user.id}
            userName={user.userName}
            isVerified={user.status === 'Verified'}
          />
        </div>
      );
    }
  }
];
