'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { PostsTableToolbar } from './posts-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { Post } from '../../services/posts.service';
import { columns } from './columns';
import { parseAsInteger, useQueryState } from 'nuqs';
import { DEFAULT_PAGE_SIZE } from '@/constants/data-table-config';

interface PostsTableProps {
  data: Post[];
  totalItems: number;
}

export function PostsTable({ data, totalItems }: PostsTableProps) {
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
      sorting: [{ id: 'created_at', desc: true }],
      columnVisibility: {
        type: true
      }
    }
  });

  return (
    <DataTable table={table}>
      <PostsTableToolbar table={table} />
    </DataTable>
  );
}
