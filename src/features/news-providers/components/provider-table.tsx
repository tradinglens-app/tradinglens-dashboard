'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Key, Trash } from 'lucide-react';
import Link from 'next/link';
import {
  ProviderConfig,
  ProviderApiKey
} from '../services/news-providers.service';
import { ProviderDialog } from './provider-dialog';
import { useState, useMemo } from 'react';
import { deleteProviderAction } from '../actions/provider-actions';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertModal } from '@/components/modal/alert-modal';
import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useDataTable } from '@/hooks/use-data-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { DEFAULT_PAGE_SIZE } from '@/constants/data-table-config';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';

export function ProviderTable({
  providers,
  totalItems
}: {
  providers: (ProviderConfig & { provider_api_keys?: ProviderApiKey[] })[];
  totalItems: number;
}) {
  const [pageSize] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(DEFAULT_PAGE_SIZE)
  );

  const [editingProvider, setEditingProvider] = useState<ProviderConfig | null>(
    null
  );

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onConfirm = async () => {
    if (!deletingId) return;
    setLoading(true);
    const result = await deleteProviderAction(deletingId);
    setLoading(false);
    setOpen(false);
    setDeletingId(null);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setOpen(true);
  };

  const columns: ColumnDef<
    ProviderConfig & { provider_api_keys?: ProviderApiKey[] }
  >[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <span className='font-medium'>{row.original.name}</span>
        )
      },
      {
        accessorKey: 'enabled',
        header: 'Status',
        cell: ({ row }) =>
          row.original.enabled ? (
            <Badge
              variant='secondary'
              className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
            >
              Active
            </Badge>
          ) : (
            <Badge variant='outline'>Inactive</Badge>
          )
      },
      {
        id: 'keys',
        header: 'API Keys',
        cell: ({ row }) => (
          <Badge variant='outline'>
            {row.original._count?.provider_api_keys || 0} keys
          </Badge>
        )
      },
      {
        accessorKey: 'updated_at',
        header: 'Last Updated',
        cell: ({ row }) =>
          format(new Date(row.original.updated_at), 'MMM d, yyyy')
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const provider = row.original;
          return (
            <div className='flex items-center justify-end gap-2 text-right'>
              <Link href={`/dashboard/news-providers/${provider.id}/keys`}>
                <Button
                  variant='outline'
                  size='sm'
                  className='hover:bg-primary shadow-sm transition-all hover:text-white'
                >
                  <Key className='mr-2 h-4 w-4' /> Manage Keys
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Open menu</span>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => setEditingProvider(provider)}
                  >
                    <Edit className='mr-2 h-4 w-4' /> Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='text-red-600 focus:bg-red-50 focus:text-red-600'
                    onClick={() => handleDelete(provider.id)}
                  >
                    <Trash className='mr-2 h-4 w-4' /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }
      }
    ],
    []
  );

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data: providers,
    columns,
    pageCount,
    rowCount: totalItems,
    shallow: false,
    initialState: {
      sorting: [{ id: 'updated_at', desc: true }]
    }
  });

  return (
    <>
      <DataTable table={table}>
        {/* We can verify if we need toolbar, for now just basic connection */}
        {/* <DataTableToolbar table={table} searchKey="name" /> */}
      </DataTable>

      <ProviderDialog
        open={!!editingProvider}
        onOpenChange={(open) => !open && setEditingProvider(null)}
        provider={editingProvider || undefined}
      />

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title='Are you sure?'
        description='This action cannot be undone. This will permanently delete the provider and remove all associated API keys.'
      />
    </>
  );
}
