'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SymbolData } from '@/features/symbols/services/symbol.service';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export const getColumns = (
  onEdit: (symbol: SymbolData) => void,
  onDelete: (symbol: SymbolData) => void
): ColumnDef<SymbolData>[] => [
  {
    accessorKey: 'symbol',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Symbol' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Avatar className='h-8 w-8 rounded-md'>
          <AvatarImage
            src={row.original.logo || ''}
            alt={row.original.symbol}
          />
          <AvatarFallback className='rounded-md'>
            {row.original.symbol.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <span className='font-medium'>{row.original.symbol}</span>
      </div>
    ),
    meta: {
      label: 'Symbol',
      variant: 'text'
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company Name' />
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Company Name',
      variant: 'text'
    }
  },
  {
    accessorKey: 'exchange',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Exchange' />
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Exchange',
      variant: 'text'
    }
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    enableColumnFilter: true,
    cell: ({ row }) => (
      <Badge variant='outline' className='capitalize'>
        {row.original.type || 'N/A'}
      </Badge>
    ),
    meta: {
      label: 'Type',
      variant: 'select',
      options: [
        { label: 'Stock', value: 'Stock' },
        { label: 'ETF', value: 'ETF' },
        { label: 'Crypto', value: 'Crypto' }
      ]
    }
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
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            <Edit className='mr-2 h-4 w-4' /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(row.original)}
            className='text-red-600 focus:text-red-600'
          >
            <Trash className='mr-2 h-4 w-4 text-red-600' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];
