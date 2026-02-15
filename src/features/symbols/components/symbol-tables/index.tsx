'use client';

import { SymbolDetailSheet } from '../symbol-detail-sheet';
import { useState } from 'react';
import { SymbolData } from '../../services/symbol.service';
import { getColumns } from './columns';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/table/data-table';
import { SymbolFormModal } from '../symbol-form-modal';
import { SymbolTableToolbar } from './symbol-table-toolbar';
import { parseAsInteger, useQueryState } from 'nuqs';
import { DEFAULT_PAGE_SIZE } from '@/constants/data-table-config';
import { AlertModal } from '@/components/modal/alert-modal';
import { deleteSymbolAction } from '../../actions/symbol-actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

interface SymbolListingProps {
  data: SymbolData[];
  totalCount: number;
  enumValues?: Record<string, string[]>;
}

export function SymbolListing({
  data,
  totalCount,
  enumValues
}: SymbolListingProps) {
  const [editingSymbol, setEditingSymbol] = useState<SymbolData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pageSize] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(DEFAULT_PAGE_SIZE)
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Detail Sheet State
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleDetail = (symbol: SymbolData) => {
    setSelectedSymbol(symbol);
    setIsDetailOpen(true);
  };

  const handleEdit = (symbol: SymbolData) => {
    setEditingSymbol(symbol);
    setIsFormOpen(true);
  };

  const handleDelete = (symbol: SymbolData) => {
    setDeleteId(symbol.id);
    setOpen(true);
  };

  const onConfirm = async () => {
    try {
      setLoading(true);
      if (deleteId) {
        await deleteSymbolAction(deleteId);
        toast.success('Symbol deleted successfully.');
        setOpen(false);
        setDeleteId(null);
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const columns = getColumns(
    handleDetail,
    handleEdit,
    handleDelete,
    enumValues
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    rowCount: totalCount,
    shallow: false,
    debounceMs: 500,
    enableAdvancedFilter: false,
    initialState: {
      columnVisibility: {
        actions: true,
        symbol: true,
        name: true,
        exchange: true,
        type: true
      }
    }
  });

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <DataTable table={table}>
        <SymbolTableToolbar table={table} enumValues={enumValues}>
          <Button
            size='sm'
            variant='default'
            className='h-8'
            onClick={() => setIsFormOpen(true)}
          >
            <Icons.add className='mr-2 h-4 w-4' /> Add Symbol
          </Button>
        </SymbolTableToolbar>
      </DataTable>
      <SymbolFormModal
        open={isFormOpen}
        onOpenChange={(open: boolean) => {
          setIsFormOpen(open);
          if (!open) setEditingSymbol(null);
        }}
        initialData={editingSymbol}
      />
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setDeleteId(null);
        }}
        onConfirm={onConfirm}
        loading={loading}
      />
      <SymbolDetailSheet
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        symbol={selectedSymbol}
      />
    </div>
  );
}
