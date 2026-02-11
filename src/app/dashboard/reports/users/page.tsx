import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const userReports = [
  {
    id: 'UR-001',
    reportedUser: 'BadBot99',
    reason: 'Bot Activity',
    reporter: 'Admin',
    status: 'Banned',
    date: '2023-10-27'
  },
  {
    id: 'UR-002',
    reportedUser: 'AngryUser',
    reason: 'Abusive Language',
    reporter: 'ModTeam',
    status: 'Warning Sent',
    date: '2023-10-26'
  }
];

export default function UserReportsPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>User Reports</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Reported Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>ID</TableHead>
                  <TableHead>Reported User</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className='font-medium'>{report.id}</TableCell>
                    <TableCell>{report.reportedUser}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>{report.reporter}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.status === 'Banned'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className={
                          report.status === 'Warning Sent'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                            : ''
                        }
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>{report.date}</TableCell>
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
