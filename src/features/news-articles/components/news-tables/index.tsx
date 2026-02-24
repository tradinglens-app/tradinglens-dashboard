'use client';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

import { useState, useMemo, useCallback } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NewsArticle } from '../../services/news.service';
import { getColumns } from './columns';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { parseAsInteger, useQueryState } from 'nuqs';
import { AlertModal } from '@/components/modal/alert-modal';
import {
  deleteNewsAction,
  deleteManyNewsAction,
  toggleNewsActiveAction
} from '../../actions/news-actions';
import { toast } from 'sonner';
import { NewsDetailSheet } from '../news-detail-sheet';
import { DuplicateFilter } from '../duplicate-filter';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BulkEditNewsDialog } from '../bulk-edit-news-dialog';
import { updateManyNewsAction } from '../../actions/news-actions';

interface NewsListingProps {
  data: NewsArticle[];
  totalCount: number;
}

import { DEFAULT_PAGE_SIZE } from '@/constants/data-table-config';

export function NewsListing({ data, totalCount }: NewsListingProps) {
  const [pageSize] = useQueryState(
    'perPage',
    parseAsInteger
      .withDefault(DEFAULT_PAGE_SIZE)
      .withOptions({ shallow: false })
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [actionType, setActionType] = useState<
    'toggle' | 'delete' | 'bulk-delete'
  >('delete');
  const [toggleToActive, setToggleToActive] = useState(false);

  // Sheet state
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleToggleActive = useCallback((news: NewsArticle) => {
    setDeleteId(news.id);
    setActionType('toggle');
    setToggleToActive(!news.isActive); // Toggle to opposite state
    setOpen(true);
  }, []);

  const handleDelete = useCallback((news: NewsArticle) => {
    setDeleteId(news.id);
    setActionType('delete');
    setOpen(true);
  }, []);

  const onConfirm = async () => {
    try {
      setLoading(true);
      if (deleteId || selectedIds.length > 0) {
        let result;
        if (actionType === 'toggle') {
          result = await toggleNewsActiveAction(deleteId!, toggleToActive);
        } else if (actionType === 'delete') {
          result = await deleteNewsAction(deleteId!);
        } else {
          result = await deleteManyNewsAction(selectedIds);
        }

        if (result.success) {
          toast.success(
            actionType === 'toggle'
              ? toggleToActive
                ? 'News article unhidden successfully.'
                : 'News article hidden successfully.'
              : actionType === 'bulk-delete'
                ? `${selectedIds.length} news articles deleted successfully.`
                : 'News article deleted successfully.'
          );
          setOpen(false);
          setDeleteId(null);
          setSelectedIds([]);
          table.toggleAllPageRowsSelected(false);
        } else {
          toast.error(result.error || 'Failed to update news article.');
        }
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = useCallback((news: NewsArticle) => {
    setSelectedNews(news);
    setIsDetailOpen(true);
  }, []);

  const columns = useMemo(
    () => getColumns(handleDetail, handleToggleActive, handleDelete),
    [handleDetail, handleToggleActive, handleDelete]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    rowCount: totalCount,
    shallow: false,
    debounceMs: 500,
    getRowId: (row) => row.id,
    enableAdvancedFilter: false,
    initialState: {
      columnVisibility: {
        title: true,
        symbol: true,
        publisher: true,
        publishedDate: true,
        language: true,
        viewCount: true,
        isFeatured: true,
        isActive: true,
        createdAt: true,
        actions: true,
        hasImage: false
      }
    }
  });

  const handleBulkDelete = useCallback(() => {
    const ids = Object.keys(table.getState().rowSelection);
    setSelectedIds(ids);
    setActionType('bulk-delete');
    setOpen(true);
  }, [table]);

  const handleBulkEdit = useCallback(() => {
    const ids = Object.keys(table.getState().rowSelection);
    setSelectedIds(ids);
    setIsBulkEditOpen(true);
  }, [table]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className='flex flex-1 flex-col space-y-4'>
        <DataTable table={table}>
          <DataTableToolbar
            table={table}
            searchKey='title'
            filterChildren={<DuplicateFilter title='Duplicates' />}
          >
            {Object.keys(table.getState().rowSelection).length > 0 && (
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8'
                  onClick={handleBulkEdit}
                >
                  <Icons.edit className='mr-2 h-4 w-4' />
                  Edit ({Object.keys(table.getState().rowSelection).length})
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
                  onClick={handleBulkDelete}
                >
                  <Trash className='mr-2 h-4 w-4' />
                  Delete ({Object.keys(table.getState().rowSelection).length})
                </Button>
              </div>
            )}
            <Link
              href='/dashboard/news-articles/new'
              className={cn(
                buttonVariants({ variant: 'default', size: 'sm' }),
                'h-8'
              )}
            >
              <Icons.add className='mr-2 h-4 w-4' /> Create New
            </Link>
          </DataTableToolbar>
        </DataTable>
        <AlertModal
          isOpen={open}
          onClose={() => {
            setOpen(false);
            setDeleteId(null);
          }}
          onConfirm={onConfirm}
          loading={loading}
          title={
            actionType === 'toggle'
              ? toggleToActive
                ? 'Unhide News Article'
                : 'Hide News Article'
              : actionType === 'bulk-delete'
                ? 'Bulk Delete News Articles'
                : 'Delete News Article'
          }
          description={
            actionType === 'toggle'
              ? toggleToActive
                ? 'Are you sure you want to unhide this news article? It will become visible to users again.'
                : 'Are you sure you want to hide this news article? It will no longer be visible to users but can be restored later.'
              : actionType === 'bulk-delete'
                ? `Are you sure you want to permanently delete these ${selectedIds.length} news articles? This action cannot be undone.`
                : 'Are you sure you want to permanently delete this news article? This action cannot be undone.'
          }
        />
        <NewsDetailSheet
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          news={selectedNews}
        />
        <BulkEditNewsDialog
          isOpen={isBulkEditOpen}
          onClose={() => setIsBulkEditOpen(false)}
          selectedIds={selectedIds}
          onSuccess={() => {
            table.toggleAllPageRowsSelected(false);
            // Optionally refresh data if needed, but revalidatePath in action handles it
          }}
        />
      </div>
    </TooltipProvider>
  );
}
