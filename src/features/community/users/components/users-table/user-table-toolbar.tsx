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

interface UserTableToolbarProps<TData> {
  table: Table<TData>;
}

export function UserTableToolbar<TData>({
  table
}: UserTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Separate states for each field
  const [name, setName] = useQueryState(
    'userName',
    parseAsString.withDefault('')
  );
  const [username, setUsername] = useQueryState(
    'username',
    parseAsString.withDefault('')
  );
  const [email, setEmail] = useQueryState(
    'email',
    parseAsString.withDefault('')
  );

  const handleNameChange = useDebouncedCallback((value: string) => {
    setName(value || null);
    table.setPageIndex(0);
  }, 300);

  const handleUsernameChange = useDebouncedCallback((value: string) => {
    setUsername(value || null);
    table.setPageIndex(0);
  }, 300);

  const handleEmailChange = useDebouncedCallback((value: string) => {
    setEmail(value || null);
    table.setPageIndex(0);
  }, 300);

  // Local state for immediate input feedback
  const [nameInput, setNameInput] = useQueryState(
    'userName',
    parseAsString.withDefault('')
  );
  const [usernameInput, setUsernameInput] = useQueryState(
    'username',
    parseAsString.withDefault('')
  );
  const [emailInput, setEmailInput] = useQueryState(
    'email',
    parseAsString.withDefault('')
  );

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Name'
          value={nameInput}
          onChange={(event) => {
            setNameInput(event.target.value);
            handleNameChange(event.target.value);
          }}
          className='h-8 w-[150px] lg:w-[200px]'
        />
        <Input
          placeholder='Username'
          value={usernameInput}
          onChange={(event) => {
            setUsernameInput(event.target.value);
            handleUsernameChange(event.target.value);
          }}
          className='h-8 w-[150px] lg:w-[200px]'
        />
        <Input
          placeholder='Email'
          value={emailInput}
          onChange={(event) => {
            setEmailInput(event.target.value);
            handleEmailChange(event.target.value);
          }}
          className='h-8 w-[150px] lg:w-[200px]'
        />

        {table.getColumn('date') && (
          <DataTableDateFilter
            column={table.getColumn('date')!}
            title='Joined At'
            multiple
          />
        )}

        {table.getColumn('accountStatus') && (
          <DataTableFacetedFilter
            column={table.getColumn('accountStatus')}
            title='Account Status'
            options={[
              { label: 'Normal', value: 'NORMAL' },
              { label: 'Warning', value: 'WARNING' },
              { label: 'Limited', value: 'LIMITED' },
              { label: 'Restricted', value: 'RESTRICTED' },
              { label: 'Suspended', value: 'SUSPENDED' },
              { label: 'Banned', value: 'BANNED' },
              { label: 'Under Review', value: 'UNDER_REVIEW' }
            ]}
          />
        )}

        {(isFiltered || nameInput || usernameInput || emailInput) && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters();
              setName(null);
              setUsername(null);
              setEmail(null);
              setNameInput('');
              setUsernameInput('');
              setEmailInput('');
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
