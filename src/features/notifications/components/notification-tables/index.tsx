'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { Notification } from '../../services/notifications.service';
import { getColumns } from './columns';
import { NotificationTableToolbar } from './notification-table-toolbar';
import { NotificationDetailSheet } from '../notification-detail-sheet';
import { parseAsInteger, useQueryState } from 'nuqs';
import { DEFAULT_PAGE_SIZE } from '@/constants/data-table-config';
import { useState, useMemo } from 'react';

interface NotificationListingProps {
  data: Notification[];
  totalCount: number;
  enumValues?: Record<string, string[]>;
}

export function NotificationListing({
  data,
  totalCount,
  enumValues
}: NotificationListingProps) {
  const [pageSize] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(DEFAULT_PAGE_SIZE)
  );

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleDetail = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailOpen(true);
  };

  const columns = useMemo(
    () => getColumns(handleDetail, enumValues),
    [enumValues]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    rowCount: totalCount,
    shallow: false,
    debounceMs: 500,
    initialState: {
      sorting: [{ id: 'created_at', desc: true }]
    }
  });

  return (
    <>
      <DataTable table={table}>
        <NotificationTableToolbar table={table} enumValues={enumValues} />
      </DataTable>
      <NotificationDetailSheet
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        notification={selectedNotification}
      />
    </>
  );
}
