'use client';

import { ColumnDef } from '@tanstack/react-table';
import { app_problem_report } from '@prisma/client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, FileText, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useState } from 'react';
import { RejectDialog } from '@/components/ui/reject-dialog';

export const getColumns = (
  onDetail: (report: app_problem_report) => void
): ColumnDef<app_problem_report>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='w-full truncate' title={row.getValue('id')}>
        {row.getValue('id')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'topic',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Topic' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('topic')}
          </span>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      placeholder: 'Search Topic'
    }
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'Open'
              ? 'destructive'
              : status === 'Resolved'
                ? 'default'
                : status === 'In Progress'
                  ? 'secondary'
                  : 'outline'
          }
          className={
            status === 'Resolved'
              ? 'bg-green-100 text-green-800 hover:bg-green-100'
              : status === 'In Progress'
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                : ''
          }
        >
          {status}
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      label: 'Status',
      variant: 'select',
      options: [
        { label: 'Open', value: 'Open' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Resolved', value: 'Resolved' },
        { label: 'Pending', value: 'Pending' }
      ]
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as Date;
      if (!date) return 'N/A';
      return format(new Date(date), 'PP p');
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      const date = new Date(row.getValue(id));
      const [start, end] = value;
      return date >= start && date <= end;
    },
    meta: {
      label: 'Created At',
      variant: 'dateRange'
    },
    enableColumnFilter: true
  },
  {
    id: 'actions',
    cell: function ActionsCell({ row }) {
      const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

      const handleReject = async (note: string) => {
        // TODO: Implement reject logic here
        console.log('Rejecting bug report:', row.original.id, 'Note:', note);
        toast.success('Bug report rejected');
      };

      return (
        <>
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
                onClick={() => onDetail(row.original)}
                className='cursor-pointer'
              >
                <FileText className='mr-2 h-4 w-4' />
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  toast.info('Mark Fixed-in-Version action triggered')
                }
                className='cursor-pointer'
              >
                <CheckCircle className='mr-2 h-4 w-4' />
                Mark Fixed-in-Version
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsRejectDialogOpen(true)}
                className='text-destructive focus:text-destructive cursor-pointer'
              >
                <X className='mr-2 h-4 w-4' />
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <RejectDialog
            open={isRejectDialogOpen}
            onOpenChange={setIsRejectDialogOpen}
            title='Reject Bug Report'
            itemTitle={row.original.topic || 'Bug Report'}
            onConfirm={handleReject}
          />
        </>
      );
    }
  }
];
