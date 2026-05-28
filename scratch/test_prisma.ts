import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
  const dummyBase64 = 'data:image/jpeg;base64,' + Buffer.alloc(3 * 1024 * 1024, 'a').toString('base64');
  try {
    const newUser = await prisma.customer.create({
      data: {
        name: "Test",
        email: "test_prisma_large@example.com",
        phone: "123",
        password: "password123",
        role: "ADMIN",
        title: "Admin",
        image: dummyBase64
      }
    });
    console.log('Created user:', newUser.id);
  } catch (e: any) {
    console.error('Prisma Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
