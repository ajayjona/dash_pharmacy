import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    const where: any = {};
    if (category && category !== 'all') {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status && status !== 'all') {
      if (status === 'active') where.isActive = true;
      if (status === 'inactive') where.isActive = false;
      if (status === 'low-stock') where.stockQty = { lt: 10 };
      if (status === 'out-of-stock') where.inStock = false;
    }

    const products = await prisma.product.findMany({
      where,
      take: limit,
      skip: skip,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple validation
    if (!body.name || !body.slug || !body.price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        category: body.category,
        description: body.description,
        price: parseFloat(body.price),
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        stockQty: parseInt(body.stockQty) || 0,
        inStock: (parseInt(body.stockQty) || 0) > 0,
        requiresPrescription: body.requiresPrescription || false,
        isActive: body.isActive !== undefined ? body.isActive : true,
        image: body.image || 'https://placehold.co/400x400/E8F5EE/1A6B4A?text=Product', // Default placeholder if none provided
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
