import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promote() {
  const user = await prisma.customer.update({
    where: { email: 'aliajonathan1@gmail.com' },
    data: { role: 'ADMIN' }
  });
  console.log('User Role Updated:', user.role);
}

promote().catch(console.error).finally(() => prisma.$disconnect());
