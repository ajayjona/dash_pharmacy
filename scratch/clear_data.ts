import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  // Delete in order to respect foreign key constraints
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  
  // Keep the admin user(s) so you don't get locked out
  await prisma.customer.deleteMany({
    where: {
      role: {
        not: 'ADMIN'
      }
    }
  });

  console.log('Database cleared of dummy data.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
