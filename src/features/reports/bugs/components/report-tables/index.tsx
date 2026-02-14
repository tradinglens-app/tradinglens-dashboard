'use client';

import { useState, useMemo } from 'react';
import { app_problem_report } from '@/generated/prisma-client';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/table/data-table';
import { ReportTableToolbar } from './report-table-toolbar';
import { parseAsInteger, useQueryState } from 'nuqs';
import { getColumns } from './columns';
import { DEFAULT_PAGE_SIZE } from '@/constants/data-table-config';

interface ReportListingProps {
  data: app_problem_report[];
  totalCount: number;
}

export function ReportListing({ data, totalCount }: ReportListingProps) {
  const [pageSize] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(DEFAULT_PAGE_SIZE)
  );

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    rowCount: totalCount,
    shallow: false,
    debounceMs: 500,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: 'created_at', desc: true }]
    }
  });

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-1'>
          {/* Allow Toolbar to take up space here if needed, or just standard header actions */}
        </div>
      </div>

      <DataTable table={table}>
        <ReportTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
