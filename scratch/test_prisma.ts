import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  try {
    const id = "00c755bb-e977-4379-bda9-83274fb70a34";
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });
    console.log("Success:", product.id);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}
run();
