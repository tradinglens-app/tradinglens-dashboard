'use client';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

import { useState } from 'react';
import { NewsArticle } from '../../services/news.service';
import { getColumns } from './columns';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { parseAsInteger, useQueryState } from 'nuqs';
import { AlertModal } from '@/components/modal/alert-modal';
import {
  deleteNewsAction,
  toggleNewsActiveAction
} from '../../actions/news-actions';
import { toast } from 'sonner';
import { NewsDetailSheet } from '../news-detail-sheet';

interface NewsListingProps {
  data: NewsArticle[];
  totalCount: number;
}

export function NewsListing({ data, totalCount }: NewsListingProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'toggle' | 'delete'>('delete');
  const [toggleToActive, setToggleToActive] = useState(false);

  // Sheet state
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleToggleActive = (news: NewsArticle) => {
    setDeleteId(news.id);
    setActionType('toggle');
    setToggleToActive(!news.isActive); // Toggle to opposite state
    setOpen(true);
  };

  const handleDelete = (news: NewsArticle) => {
    setDeleteId(news.id);
    setActionType('delete');
    setOpen(true);
  };

  const onConfirm = async () => {
    try {
      setLoading(true);
      if (deleteId) {
        const result =
          actionType === 'toggle'
            ? await toggleNewsActiveAction(deleteId, toggleToActive)
            : await deleteNewsAction(deleteId);

        if (result.success) {
          toast.success(
            actionType === 'toggle'
              ? toggleToActive
                ? 'News article unhidden successfully.'
                : 'News article hidden successfully.'
              : 'News article deleted successfully.'
          );
          setOpen(false);
          setDeleteId(null);
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

  const handleDetail = (news: NewsArticle) => {
    setSelectedNews(news);
    setIsDetailOpen(true);
  };

  const columns = getColumns(handleDetail, handleToggleActive, handleDelete);

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
        title: true,
        symbol: true,
        publisher: true,
        publishedDate: true,
        language: true,
        viewCount: true,
        isFeatured: true,
        isActive: true,
        createdAt: true,
        actions: true
      }
    }
  });

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <DataTable table={table}>
        <DataTableToolbar table={table} searchKey='title'>
          <Link
            href='/dashboard/news/new'
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
            : 'Delete News Article'
        }
        description={
          actionType === 'toggle'
            ? toggleToActive
              ? 'Are you sure you want to unhide this news article? It will become visible to users again.'
              : 'Are you sure you want to hide this news article? It will no longer be visible to users but can be restored later.'
            : 'Are you sure you want to permanently delete this news article? This action cannot be undone.'
        }
      />
      <NewsDetailSheet
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        news={selectedNews}
      />
    </div>
  );
}
