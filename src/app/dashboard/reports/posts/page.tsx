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

const postReports = [
  {
    id: 'PR-001',
    postTitle: 'Inappropriate content in comments',
    reason: 'Harassment',
    reporter: 'User123',
    status: 'Pending',
    date: '2023-10-26'
  },
  {
    id: 'PR-002',
    postTitle: 'Spam link in post',
    reason: 'Spam',
    reporter: 'User456',
    status: 'Reviewed',
    date: '2023-10-25'
  }
];

export default function PostReportsPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Post Reports</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Reported Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>ID</TableHead>
                  <TableHead>Post Title</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className='font-medium'>{report.id}</TableCell>
                    <TableCell>{report.postTitle}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>{report.reporter}</TableCell>
                    <TableCell>
                      <Badge
                        variant='secondary'
                        className={
                          report.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                            : 'bg-green-100 text-green-800 hover:bg-green-100'
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
