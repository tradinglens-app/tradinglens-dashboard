import { prisma } from '@/lib/prisma';
import { PostReport } from '../components/columns';

export const getPostReports = async (): Promise<PostReport[]> => {
  const comments = await prisma.comments.findMany({
    take: 20,
    orderBy: { created_at: 'desc' },
    include: {
      // Assuming we might want user details later, but for now just ID
    }
  });

  return comments.map((comment) => ({
    id: comment.id.toString(),
    postTitle:
      comment.content.substring(0, 50) +
      (comment.content.length > 50 ? '...' : ''),
    reason: 'Auto-flagged', // Placeholder as we don't have real reports
    reporter: `User ${comment.user_id}`,
    status: 'Pending', // Placeholder
    date: comment.created_at
      ? new Date(comment.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  }));
};
