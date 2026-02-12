'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';

export type PostReport = {
  id: string;
  postTitle: string;
  reason: string;
  reporter: string;
  status: string;
  date: string;
};

export const columns: ColumnDef<PostReport>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'postTitle',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Post Title' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[500px] truncate font-medium'>
        {row.getValue('postTitle')}
      </div>
    )
  },
  {
    accessorKey: 'reason',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reason' />
    ),
    cell: ({ row }) => <div>{row.getValue('reason')}</div>
  },
  {
    accessorKey: 'reporter',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reporter' />
    ),
    cell: ({ row }) => <div>{row.getValue('reporter')}</div>
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
            status === 'Pending'
              ? 'destructive'
              : status === 'Reviewed'
                ? 'default'
                : 'secondary'
          }
        >
          {status}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => <div>{row.getValue('date')}</div>
  }
];
