'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { VerificationTableToolbar } from './verification-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { VerificationRequest } from '../../services/user.service';
import { getColumns } from './columns';
import { UserDetailSheet } from '../user-detail-sheet';
import { useState } from 'react';
import { updateVerificationStatus } from '../../actions/user-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UserTableProps {
  data: VerificationRequest[];
  totalItems: number;
}

export function UserTable({ data, totalItems }: UserTableProps) {
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalItems / pageSize);
  const router = useRouter();

  const [selectedUser, setSelectedUser] = useState<VerificationRequest | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleDetail = (user: VerificationRequest) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleVerify = async (user: VerificationRequest) => {
    const result = await updateVerificationStatus(user.id, true);
    if (result.success) {
      toast.success('User verified successfully');
      router.refresh(); // Or optimistically update
    } else {
      toast.error(result.error || 'Failed to verify user');
    }
  };

  const handleRevoke = async (user: VerificationRequest) => {
    const result = await updateVerificationStatus(user.id, false);
    if (result.success) {
      toast.success('Verification revoked successfully');
      router.refresh(); // Or optimistically update
    } else {
      toast.error(result.error || 'Failed to revoke verification');
    }
  };

  const columns = getColumns(handleDetail, handleVerify, handleRevoke);

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
        <VerificationTableToolbar table={table} />
      </DataTable>
      <UserDetailSheet
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        user={selectedUser}
      />
    </>
  );
}
