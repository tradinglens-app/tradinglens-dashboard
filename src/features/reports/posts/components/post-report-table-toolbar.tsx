'use client';

import { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { DataTableDateFilter } from '@/components/ui/table/data-table-date-filter';
import { useQueryState, parseAsString } from 'nuqs';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';

interface PostReportTableToolbarProps<TData> {
  table: Table<TData>;
}

export function PostReportTableToolbar<TData>({
  table
}: PostReportTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Separate states for each field (URL synced)
  const [id, setId] = useQueryState('id', parseAsString.withDefault(''));
  const [postTitle, setPostTitle] = useQueryState(
    'postTitle',
    parseAsString.withDefault('')
  );

  // Local state for immediate input feedback
  const [idInput, setIdInput] = useState(id || '');
  const [postTitleInput, setPostTitleInput] = useState(postTitle || '');

  const handleIdChange = useDebouncedCallback((value: string) => {
    setId(value || null, { shallow: false });
    table.setPageIndex(0);
  }, 300);

  const handlePostTitleChange = useDebouncedCallback((value: string) => {
    setPostTitle(value || null, { shallow: false });
    table.setPageIndex(0);
  }, 300);

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Search ID...'
          value={idInput}
          onChange={(event) => {
            setIdInput(event.target.value);
            handleIdChange(event.target.value);
          }}
          className='h-8 w-[150px] lg:w-[200px]'
        />
        <Input
          placeholder='Search Post Title...'
          value={postTitleInput}
          onChange={(event) => {
            setPostTitleInput(event.target.value);
            handlePostTitleChange(event.target.value);
          }}
          className='h-8 w-[150px] lg:w-[250px]'
        />

        {table.getColumn('created_at') && (
          <DataTableDateFilter
            column={table.getColumn('created_at')!}
            title='Date'
            multiple
          />
        )}

        {(isFiltered || idInput || postTitleInput) && (
          <Button
            variant='ghost'
            onClick={async () => {
              table.resetColumnFilters();
              setIdInput('');
              setPostTitleInput('');
              await setId(null, { shallow: false });
              await setPostTitle(null, { shallow: false });
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
