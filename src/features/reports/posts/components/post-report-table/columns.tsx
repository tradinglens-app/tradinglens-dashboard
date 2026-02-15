'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal, X, FileText } from 'lucide-react';
import { DateCell } from '@/components/ui/date-cell';
import { useState } from 'react';
import { ReportReasonsModal } from '../report-reasons-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { RejectDialog } from '@/components/ui/reject-dialog';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Post } from '@/features/community/posts/services/posts.service';
import { PostDetailSheet } from '@/features/community/posts/components/post-detail-sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

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
  postDetails: Post;
};

export const columns: ColumnDef<PostReport>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='truncate'>{row.getValue('id')}</div>,
    size: 280,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'postTitle',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Post Title' />
    ),
    cell: ({ row }) => {
      const title = row.getValue('postTitle') as string;
      const fullContent = row.original.postDetails.content;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='cursor-pointer truncate font-medium'>{title}</div>
          </TooltipTrigger>
          <TooltipContent
            className='max-w-[300px] border-none bg-[#6EE7B7] px-3 py-2 font-normal text-[#064E3B] shadow-md'
            side='top'
          >
            {fullContent || title}
          </TooltipContent>
        </Tooltip>
      );
    },
    size: 200,
    enableSorting: true
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
    enableSorting: true,
    cell: ({ row }) => {
      const count = row.getValue('reportCount') as number;
      return (
        <Badge variant='secondary'>
          {count} {count === 1 ? 'report' : 'reports'}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => <DateCell date={row.original.created_at} />,
    size: 180,
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
      const [isDetailOpen, setIsDetailOpen] = useState(false);

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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
                <FileText className='mr-2 h-4 w-4' />
                View Detail
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsRejectDialogOpen(true)}
                className='text-destructive focus:text-destructive'
              >
                <X className='mr-2 h-4 w-4' />
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <PostDetailSheet
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            post={row.original.postDetails}
          />

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
