import { prisma } from './src/lib/prisma';

async function main() {
  const count = await prisma.stock_news.count();
  console.log(`Total stock_news: ${count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
