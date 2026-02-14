'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { CommunityUser } from '../../services/community-users.service';
import { getColumns } from './columns';
import { UserDetailSheet } from '../user-detail-sheet';
import { useState } from 'react';
import { updateUserAccountStatusAction } from '../../actions/community-users-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { UserTableToolbar } from './user-table-toolbar';
import { DEFAULT_PAGE_SIZE } from '@/constants/data-table-config';

interface UsersTableProps {
  data: CommunityUser[];
  totalItems: number;
}

export function UsersTable({ data, totalItems }: UsersTableProps) {
  const [pageSize] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(DEFAULT_PAGE_SIZE)
  );
  const pageCount = Math.ceil(totalItems / pageSize);
  const router = useRouter();

  const [selectedUser, setSelectedUser] = useState<CommunityUser | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleDetail = (user: CommunityUser) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleStatusChange = async (user: CommunityUser, status: string) => {
    const result = await updateUserAccountStatusAction(user.id, status);
    if (result.success) {
      toast.success(`User account status updated to ${status}`);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to update user status');
    }
  };

  const columns = getColumns(handleDetail, handleStatusChange);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    rowCount: totalItems,
    initialState: {
      sorting: [{ id: 'date', desc: true }]
    },
    shallow: false,
    debounceMs: 500
  });

  return (
    <>
      <DataTable table={table}>
        <UserTableToolbar table={table} />
      </DataTable>
      <UserDetailSheet
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        user={selectedUser}
      />
    </>
  );
}
