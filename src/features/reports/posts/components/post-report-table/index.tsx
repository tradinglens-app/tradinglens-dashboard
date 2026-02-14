'use client';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/table/data-table';
import { PostReportTableToolbar } from './post-report-table-toolbar';
import { columns, PostReport } from './columns';

import { useQueryState, parseAsInteger } from 'nuqs';
import { DEFAULT_PAGE_SIZE } from '@/constants/data-table-config';

interface PostReportListingProps {
  data: PostReport[];
  totalCount: number;
}

export function PostReportListing({
  data,
  totalCount
}: PostReportListingProps) {
  const [pageSize] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(DEFAULT_PAGE_SIZE)
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    rowCount: totalCount,
    shallow: false
  });

  return (
    <DataTable table={table}>
      <PostReportTableToolbar table={table} />
    </DataTable>
  );
}
