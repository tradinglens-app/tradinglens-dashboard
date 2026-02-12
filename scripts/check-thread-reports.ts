import { prismaThread } from '../src/lib/prisma-thread';

async function main() {
  try {
    console.log('Connecting to Thread DB...');
    const count = await prismaThread.threadReports.count();
    console.log(`ThreadReports count: ${count}`);

    if (count > 0) {
      const first = await prismaThread.threadReports.findFirst();
      console.log('First report:', first);
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prismaThread.$disconnect();
  }
}

main();
