'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { NewsArticle } from '../../services/news.service';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Eye } from 'lucide-react';
import { formatDateApp } from '@/lib/format';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export const getColumns = (
  onDetail?: (news: NewsArticle) => void,
  onEdit?: (news: NewsArticle) => void,
  onDelete?: (news: NewsArticle) => void
): ColumnDef<NewsArticle>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='flex max-w-[300px] cursor-pointer gap-3'>
              {row.original.imageUrl && (
                <img
                  src={row.original.imageUrl}
                  alt={row.original.title}
                  className='h-12 w-12 shrink-0 rounded-full object-cover'
                />
              )}
              <div className='flex min-w-0 flex-1 flex-col justify-center'>
                <div className='truncate text-sm leading-tight font-medium'>
                  {row.getValue('title')}
                </div>
                {row.original.summary && (
                  <div className='text-muted-foreground mt-1 truncate text-xs'>
                    {row.original.summary}
                  </div>
                )}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className='max-w-md'>
            <div className='space-y-2'>
              {row.original.imageUrl && (
                <img
                  src={row.original.imageUrl}
                  alt={row.original.title}
                  className='w-full rounded object-cover'
                />
              )}
              <h4 className='font-semibold'>{row.original.title}</h4>
              {row.original.summary && (
                <p className='text-muted-foreground text-sm'>
                  {row.original.summary}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    enableSorting: true,
    enableHiding: false,
    size: 300
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
      <div className='truncate'>{row.getValue('publisher') || 'N/A'}</div>
    ),
    enableSorting: true,
    meta: {
      label: 'Publisher',
      variant: 'text'
    },
    enableColumnFilter: true
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
          {formatDateApp(date, 'MMM d, yyyy h:mm a')}
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
    }
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <Badge variant={row.getValue('isActive') ? 'default' : 'secondary'}>
        {row.getValue('isActive') ? 'Active' : 'Hidden'}
      </Badge>
    ),
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(String(row.getValue(id)));
    },
    meta: {
      label: 'Status',
      variant: 'select',
      options: [
        { label: 'Active', value: 'true' },
        { label: 'Hidden', value: 'false' }
      ]
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return date ? formatDateApp(date) : '-';
    },
    enableSorting: true,
    meta: {
      label: 'Created At',
      variant: 'dateRange'
    },
    enableColumnFilter: true
  },
  {
    id: 'actions',
    header: () => null,
    cell: ({ row }) => {
      const news = row.original;
      const isActive = news.isActive;

      return (
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <Icons.moreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {onDetail && (
                <DropdownMenuItem
                  onClick={() => onDetail(news)}
                  className='cursor-pointer'
                >
                  <Eye className='mr-2 h-4 w-4' />
                  View Details
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/news-articles/${news.id}`}
                  className='flex w-full cursor-pointer items-center'
                >
                  <Icons.edit className='mr-2 h-4 w-4' />
                  Edit
                </Link>
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(news)}
                  className='cursor-pointer'
                >
                  {isActive ? (
                    <>
                      <Icons.eyeOff className='mr-2 h-4 w-4' />
                      Hide
                    </>
                  ) : (
                    <>
                      <Icons.eye className='mr-2 h-4 w-4' />
                      Unhide
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(news)}
                    className='cursor-pointer text-red-600 focus:text-red-600'
                  >
                    <Icons.trash className='mr-2 h-4 w-4' />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];
