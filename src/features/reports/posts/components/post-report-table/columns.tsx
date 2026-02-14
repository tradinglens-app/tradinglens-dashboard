'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal, X } from 'lucide-react';
import { formatDateApp } from '@/lib/format';
import { useState } from 'react';
import { ReportReasonsModal } from '../report-reasons-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { RejectDialog } from '@/components/ui/reject-dialog';

interface ReportReason {
  titleEn?: string;
  descriptionEn?: string;
  titleTh?: string;
  descriptionTh?: string;
}

export type PostReport = {
  id: string;
  postTitle: string;
  reasons: ReportReason[];
  reportCount: number;
  date: string;
  created_at: string;
};

export const columns: ColumnDef<PostReport>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='w-[100px]'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'postTitle',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Post Title' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[300px] truncate font-medium'>
        {row.getValue('postTitle')}
      </div>
    )
  },
  {
    id: 'reasons',
    header: 'Reasons',
    cell: function ActionsCell({ row }) {
      const [isModalOpen, setIsModalOpen] = useState(false);

      return (
        <>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsModalOpen(true)}
          >
            <Eye className='mr-2 h-4 w-4' />
            View Reasons
          </Button>
          <ReportReasonsModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            reasons={row.original.reasons}
            postTitle={row.original.postTitle}
            reportCount={row.original.reportCount}
          />
        </>
      );
    }
  },
  {
    accessorKey: 'reportCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reports' />
    ),
    cell: ({ row }) => {
      const count = row.getValue('reportCount') as number;
      return (
        <Badge variant='secondary'>
          {count} {count === 1 ? 'report' : 'reports'}
        </Badge>
      );
    }
  },
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Status' />
  //   ),
  //   cell: ({ row }) => <div>{row.getValue('status')}</div>
  // },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => (
      <div className='w-[150px]'>{formatDateApp(row.original.created_at)}</div>
    ),
    enableSorting: true,
    filterFn: 'inNumberRange',
    meta: {
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
        console.log('Rejecting report:', row.original.id, 'Note:', note);
        // You can add API call here to update the report status
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
              <DropdownMenuItem
                onClick={() => setIsRejectDialogOpen(true)}
                className='text-destructive focus:text-destructive'
              >
                <X className='mr-2 h-4 w-4' />
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <RejectDialog
            open={isRejectDialogOpen}
            onOpenChange={setIsRejectDialogOpen}
            title='Reject Report'
            itemTitle={row.original.postTitle}
            onConfirm={handleReject}
          />
        </>
      );
    }
  }
];
