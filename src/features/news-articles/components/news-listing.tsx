'use client';

import { useState } from 'react';
import { NewsArticle } from '../services/news.service';
import { getColumns } from './news-tables/columns';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { parseAsInteger, useQueryState } from 'nuqs';
import { AlertModal } from '@/components/modal/alert-modal';
import { deleteNewsAction } from '../actions/news-actions';
import { toast } from 'sonner';

interface NewsListingProps {
  data: NewsArticle[];
  totalCount: number;
}

export function NewsListing({ data, totalCount }: NewsListingProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (news: NewsArticle) => {
    // TODO: Implement edit modal
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = (news: NewsArticle) => {
    setDeleteId(news.id);
    setOpen(true);
  };

  const onConfirm = async () => {
    try {
      setLoading(true);
      if (deleteId) {
        const result = await deleteNewsAction(deleteId);
        if (result.success) {
          toast.success('News article deleted successfully.');
          setOpen(false);
          setDeleteId(null);
        } else {
          toast.error(result.error || 'Failed to delete news article.');
        }
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const columns = getColumns(handleEdit, handleDelete);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    shallow: false,
    debounceMs: 500,
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
        actions: true
      }
    }
  });

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <DataTable table={table}>
        <DataTableToolbar table={table} searchKey='title' />
      </DataTable>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setDeleteId(null);
        }}
        onConfirm={onConfirm}
        loading={loading}
      />
    </div>
  );
}
