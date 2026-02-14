import { prisma } from '../src/lib/prisma';

async function main() {
  const count = await prisma.symbol.count();
  console.log(`Total symbols: ${count}`);

  if (count > 0) {
    const samples = await prisma.symbol.findMany({ take: 5 });
    console.log('Sample symbols:', JSON.stringify(samples, null, 2));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
