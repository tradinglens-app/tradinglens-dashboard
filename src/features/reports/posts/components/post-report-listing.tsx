'use client';

import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { columns, PostReport } from './columns';

interface PostReportListingProps {
  data: PostReport[];
}

export function PostReportListing({ data }: PostReportListingProps) {
  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} searchKey='postTitle' />
    </DataTable>
  );
}
