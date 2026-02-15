'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { NewsArticle } from '../../services/news.service';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Eye } from 'lucide-react';
import { formatDateApp } from '@/lib/format';
import { DateCell } from '@/components/ui/date-cell';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

import Image from 'next/image';

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

import { invalidateNewsImageAction } from '../../actions/news-actions';

const NewsImageCell = ({
  imageUrl,
  title,
  id
}: {
  imageUrl: string;
  title: string;
  id: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Check URL validity immediately
  if (error || !imageUrl || !isValidUrl(imageUrl)) {
    return (
      <div className='bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-full'>
        <Icons.post className='text-muted-foreground h-6 w-6' />
      </div>
    );
  }

  return (
    <div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-full'>
      {isLoading && <Skeleton className='absolute inset-0 h-full w-full' />}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        sizes='48px'
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
          // Self-healing: Invalidate image in DB
          invalidateNewsImageAction(id);
        }}
      />
    </div>
  );
};

const NewsTooltipImage = ({
  imageUrl,
  title
}: {
  imageUrl: string;
  title: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Check URL validity immediately
  if (error || !imageUrl || !isValidUrl(imageUrl)) {
    return (
      <div className='bg-muted flex aspect-video w-full items-center justify-center rounded'>
        <Icons.post className='text-muted-foreground h-12 w-12' />
      </div>
    );
  }

  return (
    <div className='relative aspect-video w-full overflow-hidden rounded'>
      {isLoading && <Skeleton className='absolute inset-0 h-full w-full' />}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        sizes='(max-width: 768px) 100vw, 400px'
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
};

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
                <NewsImageCell
                  imageUrl={row.original.imageUrl}
                  title={row.original.title}
                  id={row.original.id}
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
                <NewsTooltipImage
                  imageUrl={row.original.imageUrl}
                  title={row.original.title}
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
    size: 200 // Increased size for title
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
    accessorKey: 'hasImage',
    id: 'hasImage', // Positioned before Status as requested
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Has Image' />
    ),
    cell: ({ row }) => {
      return null; // Hidden column, or could show an icon
    },
    enableSorting: false,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(String(row.getValue(id)));
    },
    accessorFn: (row) => (row.imageUrl ? 'true' : 'false'),
    meta: {
      label: 'Image',
      variant: 'select',
      options: [
        { label: 'Has Image', value: 'true' },
        { label: 'No Image', value: 'false' }
      ]
    },
    enableColumnFilter: true
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
