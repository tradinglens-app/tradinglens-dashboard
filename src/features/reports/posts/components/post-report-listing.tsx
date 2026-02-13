'use client';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/table/data-table';
import { PostReportTableToolbar } from './post-report-table-toolbar';
import { columns, PostReport } from './columns';

import { useQueryState, parseAsInteger } from 'nuqs';

interface PostReportListingProps {
  data: PostReport[];
  totalCount: number;
}

export function PostReportListing({
  data,
  totalCount
}: PostReportListingProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    shallow: false
  });

  return (
    <DataTable table={table}>
      <PostReportTableToolbar table={table} />
    </DataTable>
  );
}
