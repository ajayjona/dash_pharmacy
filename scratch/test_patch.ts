import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const product = await prisma.product.findFirst();
  if (!product) { console.log('No products'); return; }
  console.log('Product:', product.id, 'isActive:', product.isActive);
  
  const res = await fetch(`http://localhost:3000/api/products/${product.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive: !product.isActive })
  });
  console.log('Status:', res.status);
  console.log('Response:', await res.text());
}
run();
