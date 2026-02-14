'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Announcement } from '../../services/announcements.service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash, Eye } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { formatDateApp } from '@/lib/format';
import { AnnouncementsDeleteDialog } from '@/features/announcements/components/announcements-delete-dialog';
import { toLabel, toOptions } from '@/lib/db-enums.utils';

export const getColumns = (
  enumValues: Record<string, string[]>
): ColumnDef<Announcement>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='truncate'>{row.getValue('id')}</div>,
    size: 60,
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'title_en',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title (EN)' />
    ),
    cell: ({ row }) => (
      <div className='truncate font-medium' title={row.getValue('title_en')}>
        {row.getValue('title_en')}
      </div>
    ),
    size: 220,
    enableColumnFilter: true,
    meta: {
      label: 'Title',
      variant: 'text'
    }
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='capitalize'>
        {row.getValue('type')}
      </Badge>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Type',
      variant: 'multiSelect',
      options: (enumValues.type || []).map((v) => ({
        label: toLabel(v),
        value: v
      }))
    }
  },
  {
    accessorKey: 'display_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Display' />
    ),
    cell: ({ row }) => (
      <Badge variant='secondary' className='capitalize'>
        {row.getValue('display_type')}
      </Badge>
    )
  },
  {
    accessorKey: 'platform',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Platform' />
    ),
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('platform') || 'all'}</div>
    )
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Priority' />
    ),
    cell: ({ row }) => (
      <div className='text-center'>{row.getValue('priority') ?? 0}</div>
    ),
    size: 80
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const active = row.getValue('is_active') as boolean | null;
      return (
        <Badge variant={active ? 'default' : 'secondary'}>
          {active ? 'Active' : 'Inactive'}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'start_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('start_at') as Date | null;
      return (
        <div className='whitespace-nowrap'>
          {date ? formatDateApp(date) : '-'}
        </div>
      );
    },
    size: 140
  },
  {
    accessorKey: 'end_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('end_at') as Date | null;
      return (
        <div className='whitespace-nowrap'>
          {date ? formatDateApp(date) : '-'}
        </div>
      );
    },
    size: 140
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as Date | null;
      return (
        <div className='whitespace-nowrap'>
          {date ? formatDateApp(date) : '-'}
        </div>
      );
    },
    size: 140,
    enableColumnFilter: true,
    meta: {
      label: 'Created At',
      variant: 'dateRange'
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell announcement={row.original} />
  }
];

function ActionCell({ announcement }: { announcement: Announcement }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnnouncementsDeleteDialog
        open={open}
        onOpenChange={setOpen}
        announcement={announcement}
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
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/announcements/${announcement.id}`}>
              <Edit className='mr-2 h-4 w-4' /> Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className='text-red-600 focus:text-red-600'
          >
            <Trash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
