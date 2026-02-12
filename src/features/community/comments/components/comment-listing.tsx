'use client';

import { useState } from 'react';
import { CommentData } from '../services/comment.service';
import { getColumns } from './columns';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { parseAsInteger, useQueryState } from 'nuqs';

interface CommentListingProps {
  data: CommentData[];
  totalCount: number;
}

export function CommentListing({ data, totalCount }: CommentListingProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const columns = getColumns();

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    shallow: false,
    debounceMs: 500,
    enableAdvancedFilter: false,
    initialState: {
      columnVisibility: {
        id: false,
        symbol: true,
        content: true,
        userId: true,
        likes: true,
        createdAt: true,
        actions: true
      }
    }
  });

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <DataTable table={table}>
        <DataTableToolbar table={table} searchKey='content' />
      </DataTable>
    </div>
  );
}
