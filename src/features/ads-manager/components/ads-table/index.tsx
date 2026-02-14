'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { AdsTableToolbar } from './ads-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { Ad } from '../../services/ads.service';
import { columns } from './columns';
import { parseAsInteger, useQueryState } from 'nuqs';
import { DEFAULT_PAGE_SIZE } from '@/constants/data-table-config';

interface AdsTableProps {
  data: Ad[];
  totalItems: number;
}

export function AdsTable({ data, totalItems }: AdsTableProps) {
  const [pageSize] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(DEFAULT_PAGE_SIZE)
  );
  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    rowCount: totalItems,
    shallow: false,
    initialState: {
      sorting: [{ id: 'id', desc: true }]
    }
  });

  return (
    <DataTable table={table}>
      <AdsTableToolbar table={table} />
    </DataTable>
  );
}
