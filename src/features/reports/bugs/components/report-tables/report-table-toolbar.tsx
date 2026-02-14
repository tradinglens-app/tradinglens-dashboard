'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { DataTableDateFilter } from '@/components/ui/table/data-table-date-filter';
import { useQueryState, parseAsString } from 'nuqs';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';

interface ReportTableToolbarProps<TData> {
  table: Table<TData>;
}

export function ReportTableToolbar<TData>({
  table
}: ReportTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Separate states for each field
  const [id, setId] = useQueryState('id', parseAsString.withDefault(''));
  const [topic, setTopic] = useQueryState(
    'topic',
    parseAsString.withDefault('')
  );

  // Also keep q for backward compatibility or reset, but we won't show an input for it
  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''));

  // Local state for immediate input feedback
  const [idInput, setIdInput] = useQueryState(
    'id',
    parseAsString.withDefault('')
  );
  const [topicInput, setTopicInput] = useQueryState(
    'topic',
    parseAsString.withDefault('')
  );

  const handleIdChange = useDebouncedCallback((value: string) => {
    setId(value || null);
    table.setPageIndex(0);
  }, 300);

  const handleTopicChange = useDebouncedCallback((value: string) => {
    setTopic(value || null);
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
          placeholder='Search Topic...'
          value={topicInput}
          onChange={(event) => {
            setTopicInput(event.target.value);
            handleTopicChange(event.target.value);
          }}
          className='h-8 w-[150px] lg:w-[250px]'
        />

        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title='Status'
            options={[
              { label: 'Open', value: 'Open' },
              { label: 'In Progress', value: 'In Progress' },
              { label: 'Resolved', value: 'Resolved' },
              { label: 'Pending', value: 'Pending' }
            ]}
          />
        )}

        {table.getColumn('created_at') && (
          <DataTableDateFilter
            column={table.getColumn('created_at')!}
            title='Created At'
            multiple
          />
        )}

        {(isFiltered || idInput || topicInput || search) && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters();
              setId(null);
              setTopic(null);
              setSearch(null); // Clear global search too if present
              setIdInput('');
              setTopicInput('');
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
