'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { NewsArticle } from '../../services/news.service';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { format } from 'date-fns';

export const getColumns = (
  onEdit?: (news: NewsArticle) => void,
  onDelete?: (news: NewsArticle) => void
): ColumnDef<NewsArticle>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[300px]'>
        <div className='truncate font-medium'>{row.getValue('title')}</div>
        {row.original.summary && (
          <div className='text-muted-foreground mt-1 truncate text-xs'>
            {row.original.summary.substring(0, 80)}...
          </div>
        )}
      </div>
    ),
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'symbol',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Symbol' />
    ),
    cell: ({ row }) => (
      <div className='font-mono font-semibold'>{row.getValue('symbol')}</div>
    ),
    enableSorting: true,
    meta: {
      label: 'Symbol',
      placeholder: 'Filter symbol...',
      variant: 'text'
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'publisher',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Publisher' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[120px] truncate'>
        {row.getValue('publisher') || 'N/A'}
      </div>
    ),
    enableSorting: true
  },
  {
    accessorKey: 'publishedDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Published' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('publishedDate') as Date;
      return (
        <div className='whitespace-nowrap'>
          {format(new Date(date), 'MMM dd, yyyy')}
        </div>
      );
    },
    enableSorting: true
  },
  {
    accessorKey: 'language',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lang' />
    ),
    cell: ({ row }) => (
      <div className='text-xs font-medium uppercase'>
        {row.getValue('language') || 'EN'}
      </div>
    ),
    enableSorting: false
  },
  {
    accessorKey: 'viewCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Views' />
    ),
    cell: ({ row }) => (
      <div className='text-right font-medium'>
        {(row.getValue('viewCount') as number).toLocaleString()}
      </div>
    ),
    enableSorting: true
  },
  {
    accessorKey: 'isFeatured',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Featured' />
    ),
    cell: ({ row }) => {
      const isFeatured = row.getValue('isFeatured') as boolean;
      const isHot = row.original.isHot;
      return (
        <div className='flex gap-1'>
          {isFeatured && (
            <Badge
              variant='default'
              className='bg-blue-100 text-blue-800 hover:bg-blue-100'
            >
              Featured
            </Badge>
          )}
          {isHot && (
            <Badge
              variant='default'
              className='bg-red-100 text-red-800 hover:bg-red-100'
            >
              Hot
            </Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      label: 'Featured',
      variant: 'multiSelect',
      options: [
        { label: 'Featured', value: 'true' },
        { label: 'Regular', value: 'false' }
      ]
    },
    enableColumnFilter: true
  },
  {
    id: 'actions',
    header: () => <div className='text-right'>Actions</div>,
    cell: ({ row }) => {
      const news = row.original;
      return (
        <div className='flex justify-end gap-2'>
          {onEdit && (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onEdit(news)}
              className='h-8 w-8'
            >
              <Icons.edit className='h-4 w-4' />
            </Button>
          )}
          {onDelete && (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDelete(news)}
              className='h-8 w-8 text-red-600 hover:text-red-700'
            >
              <Icons.trash className='h-4 w-4' />
            </Button>
          )}
        </div>
      );
    }
  }
];
