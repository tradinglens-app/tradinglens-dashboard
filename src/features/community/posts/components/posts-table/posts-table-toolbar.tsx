'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';

import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { DataTableDateFilter } from '@/components/ui/table/data-table-date-filter';

interface PostsTableToolbarProps<TData> {
  table: Table<TData>;
}

export function PostsTableToolbar<TData>({
  table
}: PostsTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className='flex w-full items-start justify-between gap-2 pb-4'>
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        <Input
          placeholder='Filter ID...'
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('id')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[200px]'
        />
        <Input
          placeholder='Filter Content...'
          value={(table.getColumn('content')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('content')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {table.getColumn('visibility') && (
          <DataTableFacetedFilter
            column={table.getColumn('visibility')}
            title='Visibility'
            options={[
              { label: 'Public', value: 'public' },
              { label: 'Followers', value: 'followers' },
              { label: 'Private', value: 'private' },
              { label: 'Mention', value: 'mention' }
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
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
