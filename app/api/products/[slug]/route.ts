import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  try {
    const params = await props.params;
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const relatedProducts = await prisma.product.findMany({
      where: { category: product.category, id: { not: product.id } },
      take: 6,
    });

    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(request: Request, props: { params: Promise<{ slug: string }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Convert string inputs to proper types for Prisma
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice ? parseFloat(body.originalPrice) : null;
    if (body.stockQty !== undefined) {
      updateData.stockQty = parseInt(body.stockQty) || 0;
      updateData.inStock = updateData.stockQty > 0;
    }
    if (body.requiresPrescription !== undefined) updateData.requiresPrescription = body.requiresPrescription;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.image !== undefined) updateData.image = body.image;

    const product = await prisma.product.update({
      where: { id: params.slug }, // Frontend passes ID here
      data: updateData,
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ slug: string }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id: params.slug }, // Frontend passes ID here
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ 
      error: 'Failed to delete product',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
