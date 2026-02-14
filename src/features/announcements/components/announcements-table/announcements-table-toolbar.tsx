'use client';

import { Table } from '@tanstack/react-table';
import { X, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';
import { DataTableDateFilter } from '@/components/ui/table/data-table-date-filter';
import Link from 'next/link';

interface AnnouncementsTableToolbarProps<TData> {
  table: Table<TData>;
}

export function AnnouncementsTableToolbar<TData>({
  table
}: AnnouncementsTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className='flex w-full items-start justify-between gap-2 pb-4'>
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        <Input
          placeholder='Filter Title (EN)...'
          value={
            (table.getColumn('title_en')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('title_en')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[200px]'
        />
        {(() => {
          const createdAtColumn = table.getColumn('created_at');
          return createdAtColumn ? (
            <DataTableDateFilter
              column={createdAtColumn}
              title='Created At'
              multiple
            />
          ) : null;
        })()}
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
        <Link href='/dashboard/announcements/new'>
          <Button size='sm' className='h-8'>
            <Plus className='mr-2 h-4 w-4' />
            Add New
          </Button>
        </Link>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
