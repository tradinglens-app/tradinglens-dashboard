import { prisma } from '@/lib/prisma';

async function main() {
  try {
    console.log('Checking comments table in Railway DB...');
    const count = await prisma.comments.count();
    console.log(`Comments count: ${count}`);

    if (count > 0) {
      const first = await prisma.comments.findFirst();
      console.log('First comment:', first);
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
