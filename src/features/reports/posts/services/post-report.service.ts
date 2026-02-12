import { prismaThread } from '@/lib/prisma-thread';
import { PostReport } from '../components/columns';

export const getPostReports = async (): Promise<PostReport[]> => {
  const reports = await prismaThread.threadReports.findMany({
    take: 20,
    orderBy: { created_at: 'desc' }
  });

  // Fetch related threads to get content
  const threadIds = reports.map((r) => r.threads_id);
  const threads = await prismaThread.threads.findMany({
    where: {
      id: { in: threadIds }
    },
    select: {
      id: true,
      content: true
    }
  });

  const threadMap = new Map(threads.map((t) => [t.id, t]));

  return reports.map((report) => {
    const thread = threadMap.get(report.threads_id);
    const content = thread?.content || 'Content not found';

    return {
      id: report.id,
      postTitle: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      reason: report.reason || 'No reason provided',
      reporter: report.reported_by ? `User ${report.reported_by}` : 'Anonymous',
      status: report.deleted_at ? 'Resolved' : 'Pending',
      date: report.created_at
        ? new Date(report.created_at).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
    };
  });
};
