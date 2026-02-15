'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';
import { useQueryState, parseAsString } from 'nuqs';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { DataTableFacetedFilter } from '@/components/ui/table/data-table-faceted-filter';
import { toOptions } from '@/lib/db-enums.utils';

interface SymbolTableToolbarProps<TData> {
  table: Table<TData>;
  enumValues?: Record<string, string[]>;
  children?: React.ReactNode;
}

export function SymbolTableToolbar<TData>({
  table,
  enumValues,
  children
}: SymbolTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [name, setName] = useQueryState('name', parseAsString.withDefault(''));
  const [symbol, setSymbol] = useQueryState(
    'symbol',
    parseAsString.withDefault('')
  );
  const [exchange, setExchange] = useQueryState(
    'exchange',
    parseAsString.withDefault('')
  );

  const handleNameChange = useDebouncedCallback((value: string) => {
    setName(value || null);
    table.setPageIndex(0);
  }, 300);

  const handleSymbolChange = useDebouncedCallback((value: string) => {
    setSymbol(value || null);
    table.setPageIndex(0);
  }, 300);

  const handleExchangeChange = useDebouncedCallback((value: string) => {
    setExchange(value || null);
    table.setPageIndex(0);
  }, 300);

  // Local state for immediate input feedback
  const [nameInput, setNameInput] = useQueryState(
    'name',
    parseAsString.withDefault('')
  );
  const [symbolInput, setSymbolInput] = useQueryState(
    'symbol',
    parseAsString.withDefault('')
  );
  const [exchangeInput, setExchangeInput] = useQueryState(
    'exchange',
    parseAsString.withDefault('')
  );

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Symbol...'
          value={symbolInput}
          onChange={(event) => {
            setSymbolInput(event.target.value);
            handleSymbolChange(event.target.value);
          }}
          className='h-8 w-[150px] lg:w-[200px]'
        />
        <Input
          placeholder='Company Name...'
          value={nameInput}
          onChange={(event) => {
            setNameInput(event.target.value);
            handleNameChange(event.target.value);
          }}
          className='h-8 w-[150px] lg:w-[200px]'
        />
        <Input
          placeholder='Exchange...'
          value={exchangeInput}
          onChange={(event) => {
            setExchangeInput(event.target.value);
            handleExchangeChange(event.target.value);
          }}
          className='h-8 w-[150px] lg:w-[200px]'
        />

        {table.getColumn('type') && (
          <DataTableFacetedFilter
            column={table.getColumn('type')}
            title='Type'
            options={
              enumValues?.type
                ? toOptions(enumValues.type)
                : [
                    { label: 'Stock', value: 'Stock' },
                    { label: 'ETF', value: 'ETF' },
                    { label: 'Crypto', value: 'Crypto' }
                  ]
            }
          />
        )}

        {table.getColumn('hasLogo') && (
          <DataTableFacetedFilter
            column={table.getColumn('hasLogo')}
            title='Image'
            options={[
              { label: 'Has Image', value: 'true' },
              { label: 'No Image', value: 'false' }
            ]}
          />
        )}

        {(isFiltered || nameInput || symbolInput || exchangeInput) && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters();
              setName(null);
              setSymbol(null);
              setExchange(null);
              setNameInput('');
              setSymbolInput('');
              setExchangeInput('');
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex items-center gap-2'>
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
