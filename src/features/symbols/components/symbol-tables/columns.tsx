'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SymbolData } from '@/features/symbols/services/symbol.service';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

export const getColumns = (
  onEdit: (symbol: SymbolData) => void
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Actions' />
    ),
    cell: ({ row }) => (
      <div className='flex justify-end'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => onEdit(row.original)}
        >
          <Edit className='h-4 w-4' />
        </Button>
      </div>
    )
  }
];
