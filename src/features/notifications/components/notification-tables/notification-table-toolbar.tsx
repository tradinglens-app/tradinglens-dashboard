'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';
import { DataTableDateFilter } from '@/components/ui/table/data-table-date-filter';
import { useQueryState, parseAsString } from 'nuqs';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { toOptions } from '@/lib/db-enums.utils';

interface NotificationTableToolbarProps<TData> {
  table: Table<TData>;
}

export function NotificationTableToolbar<TData>({
  table,
  enumValues
}: NotificationTableToolbarProps<TData> & {
  enumValues?: Record<string, string[]>;
}) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''));
  const [searchInput, setSearchInput] = useQueryState(
    'q',
    parseAsString.withDefault('')
  );

  const handleSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value || null);
    table.setPageIndex(0);
  }, 300);

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Search ID or messages...'
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
            handleSearchChange(event.target.value);
          }}
          className='h-8 w-[200px] lg:w-[300px]'
        />

        {table.getColumn('is_read') && (
          <DataTableFacetedFilter
            column={table.getColumn('is_read')}
            title='Status'
            options={[
              { label: 'Read', value: 'true' },
              { label: 'Unread', value: 'false' }
            ]}
            multiple
          />
        )}

        {table.getColumn('type') && (
          <DataTableFacetedFilter
            column={table.getColumn('type')}
            title='Type'
            options={
              enumValues?.type
                ? toOptions(enumValues.type)
                : [
                    { label: 'Like', value: 'like' },
                    { label: 'Reply', value: 'reply' },
                    { label: 'Mention', value: 'mention' },
                    { label: 'Follow', value: 'follow' },
                    { label: 'System', value: 'system' }
                  ]
            }
            multiple
          />
        )}

        {table.getColumn('created_at') && (
          <DataTableDateFilter
            column={table.getColumn('created_at')!}
            title='Created At'
            multiple
          />
        )}

        {(isFiltered || searchInput) && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters();
              setSearch(null);
              setSearchInput('');
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
