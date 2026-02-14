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

interface VerificationTableToolbarProps<TData> {
  table: Table<TData>;
}

export function VerificationTableToolbar<TData>({
  table
}: VerificationTableToolbarProps<TData>) {
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
          placeholder='Full Name'
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

        {table.getColumn('created_at') && (
          <DataTableDateFilter
            column={table.getColumn('created_at')!}
            title='Joined At'
            multiple
          />
        )}

        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title='Status'
            options={[
              { label: 'Verified', value: 'Verified' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Unverified', value: 'Unverified' }
            ]}
            multiple
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
