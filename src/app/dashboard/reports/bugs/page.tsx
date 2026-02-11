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

const bugReports = [
  {
    id: 'BUG-001',
    title: 'Login page crashes on mobile',
    reporter: 'Alice Smith',
    status: 'Open',
    date: '2023-10-25'
  },
  {
    id: 'BUG-002',
    title: 'Profile image not updating',
    reporter: 'Bob Jones',
    status: 'In Progress',
    date: '2023-10-24'
  },
  {
    id: 'BUG-003',
    title: 'Typo in dashboard header',
    reporter: 'Charlie Brown',
    status: 'Resolved',
    date: '2023-10-23'
  }
];

export default function BugReportsPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Bug Reports</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Bug Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bugReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className='font-medium'>{report.id}</TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{report.reporter}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.status === 'Open' ? 'destructive' : 'secondary'
                        }
                        className={
                          report.status === 'Resolved'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : report.status === 'In Progress'
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
