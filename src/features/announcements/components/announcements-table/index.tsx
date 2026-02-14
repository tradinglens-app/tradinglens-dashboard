'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { AnnouncementsTableToolbar } from './announcements-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { Announcement } from '../../services/announcements.service';
import { columns } from './columns';
import { parseAsInteger, useQueryState } from 'nuqs';
import { DEFAULT_PAGE_SIZE } from '@/constants/data-table-config';

interface AnnouncementsTableProps {
  data: Announcement[];
  totalItems: number;
}

export function AnnouncementsTable({
  data,
  totalItems
}: AnnouncementsTableProps) {
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
      <AnnouncementsTableToolbar table={table} />
    </DataTable>
  );
}
