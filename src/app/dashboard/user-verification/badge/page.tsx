import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { IconCheck, IconX } from '@tabler/icons-react';

const verificationRequests = [
  {
    id: 'VR-001',
    userName: 'John Doe',
    email: 'john.doe@example.com',
    status: 'Pending',
    date: '2023-11-01'
  },
  {
    id: 'VR-002',
    userName: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'Verified',
    date: '2023-10-30'
  },
  {
    id: 'VR-003',
    userName: 'Fake User',
    email: 'fake@example.com',
    status: 'Rejected',
    date: '2023-10-29'
  }
];

export default function BadgeVerificationPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Badge Verification
          </h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Verification Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>ID</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verificationRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className='font-medium'>{request.id}</TableCell>
                    <TableCell>{request.userName}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === 'Verified'
                            ? 'default'
                            : request.status === 'Rejected'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className={
                          request.status === 'Verified'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : request.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                              : ''
                        }
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell className='text-right'>
                      {request.status === 'Pending' && (
                        <div className='flex justify-end gap-2'>
                          <Button
                            size='icon'
                            variant='ghost'
                            className='h-8 w-8 text-green-600 hover:bg-green-100 hover:text-green-700'
                          >
                            <IconCheck className='h-4 w-4' />
                          </Button>
                          <Button
                            size='icon'
                            variant='ghost'
                            className='h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700'
                          >
                            <IconX className='h-4 w-4' />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
