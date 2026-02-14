'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Ad } from '../../services/ads.service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash, FileText, Eye } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import Link from 'next/link';
import { useState } from 'react';
import { AdsDeleteDialog } from '@/features/ads-manager/components/ads-delete-dialog';

export const columns: ColumnDef<Ad>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='truncate'>{row.getValue('id')}</div>,
    size: 80,
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'title_en',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title (EN)' />
    ),
    cell: ({ row }) => (
      <div className='truncate' title={row.getValue('title_en')}>
        {row.getValue('title_en')}
      </div>
    ),
    size: 200,
    enableColumnFilter: true
  },
  {
    accessorKey: 'title_th',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title (TH)' />
    ),
    cell: ({ row }) => (
      <div className='truncate' title={row.getValue('title_th')}>
        {row.getValue('title_th')}
      </div>
    ),
    size: 200,
    enableColumnFilter: true
  },
  {
    accessorKey: 'description_en',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description (EN)' />
    ),
    cell: ({ row }) => (
      <div className='truncate' title={row.getValue('description_en')}>
        {row.getValue('description_en')}
      </div>
    ),
    size: 250,
    enableColumnFilter: true
  },
  {
    accessorKey: 'description_th',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description (TH)' />
    ),
    cell: ({ row }) => (
      <div className='truncate' title={row.getValue('description_th')}>
        {row.getValue('description_th')}
      </div>
    ),
    size: 250,
    enableColumnFilter: true
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => <div>{row.getValue('type')}</div>
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell ad={row.original} />
  }
];

function ActionCell({ ad }: { ad: Ad }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdsDeleteDialog open={open} onOpenChange={setOpen} ad={ad} />
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
            <Link href={`/dashboard/ads-manager/${ad.id}`}>
              <Eye className='mr-2 h-4 w-4' /> View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/ads-manager/${ad.id}`}>
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
