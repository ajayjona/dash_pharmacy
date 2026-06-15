import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalProducts, outOfStock, lowStock, activeProducts, rxProducts] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { stockQty: { lte: 0 } } }),
      prisma.product.count({ where: { stockQty: { gt: 0, lt: 10 } } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { requiresPrescription: true } })
    ]);

    return NextResponse.json({
      totalProducts,
      outOfStock,
      lowStock,
      activeProducts,
      rxProducts
    });
  } catch (error) {
    console.error('Failed to fetch product stats:', error);
    return NextResponse.json({ error: 'Failed to fetch product stats' }, { status: 500 });
  }
}
