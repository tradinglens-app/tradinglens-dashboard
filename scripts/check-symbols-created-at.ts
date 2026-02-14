import { prisma } from '../src/lib/prisma';

async function main() {
  try {
    console.log('Checking symbol table in Railway DB...');
    const total = await prisma.symbol.count();
    console.log(`Total symbols: ${total}`);

    const nullCreatedAt = await prisma.symbol.count({
      where: {
        created_at: null
      }
    });

    console.log(`Symbols with null created_at: ${nullCreatedAt}`);

    if (nullCreatedAt > 0) {
      console.log('Found null values. These need filler.');
    } else {
      console.log('No null values found.');
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
