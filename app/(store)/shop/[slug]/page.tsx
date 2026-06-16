'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Truck, AlertTriangle, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/slices/cartSlice';
import { formatPrice } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('Overview');
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-green" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-lg text-text-muted">Product not found</div>;

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-text-muted mb-8">
          <Link href="/" className="hover:text-primary-green">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/shop" className="hover:text-primary-green">Shop</Link>
          <span className="mx-2">&gt;</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-primary-green">{product.category}</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-text-secondary">{product.name}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-12 mb-16">
          
          {/* Left - Image Gallery */}
          <div className="flex-1">
            <div className="relative aspect-square rounded-2xl bg-surface border border-border overflow-hidden mb-4">
              <Image src={product.image} alt={product.name} fill className="object-contain p-8" />
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`relative aspect-square rounded-lg bg-surface border overflow-hidden cursor-pointer ${i === 1 ? 'border-primary-green ring-1 ring-primary-green' : 'border-border opacity-70 hover:opacity-100'}`}>
                  <Image src={product.image} alt={`${product.name} view ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>

            {product.requiresPrescription && (
              <div className="bg-[#FEF3E8] border border-[#F4A820]/30 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-[#B36B00] shrink-0" />
                <p className="text-sm text-[#B36B00]">
                  <strong>This product requires a valid prescription.</strong> You can upload yours in your account or during checkout.
                </p>
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-serif text-text-primary mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-mono font-bold text-primary-green">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-lg font-mono text-text-muted line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-warning text-surface text-xs font-bold px-2 py-1 rounded">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="mb-6">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary-green text-sm font-medium border border-primary-green/20">
                  <span className="w-2 h-2 rounded-full bg-primary-green"></span>
                  In stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 text-danger text-sm font-medium border border-danger/20">
                  <span className="w-2 h-2 rounded-full bg-danger"></span>
                  Out of stock
                </span>
              )}
            </div>

            <p className="text-text-secondary leading-relaxed mb-8">
              {product.description || `High-quality ${product.category.toLowerCase()} product. Used for the treatment and management of relevant health conditions. Please read the label carefully before use.`}
            </p>

            <div className="flex flex-col gap-6 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-text-primary w-20">Quantity</span>
                <div className="flex items-center border border-border rounded-lg bg-surface">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={!product.inStock}
                    className="p-3 text-text-muted hover:text-primary-green transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input 
                    type="number" 
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    disabled={!product.inStock}
                    className="w-12 text-center font-mono font-medium text-text-primary bg-transparent border-none focus:ring-0 p-0"
                  />
                  <button 
                    onClick={() => setQty(qty + 1)}
                    disabled={!product.inStock}
                    className="p-3 text-text-muted hover:text-primary-green transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {product.inStock && product.stockQty && (
                  <span className="text-sm text-text-muted">({product.stockQty} in stock)</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  disabled={!product.inStock}
                  onClick={() => dispatch(addItem({ product, quantity: qty }))}
                  className="flex-1"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to cart
                </Button>
                <Button variant="outline" size="lg" className="px-4">
                  <Heart className="w-5 h-5 text-text-secondary" />
                </Button>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-4 flex gap-4 mb-6">
              <Truck className="w-6 h-6 text-primary-green shrink-0" />
              <div>
                <h4 className="font-medium text-text-primary mb-1">Fast Delivery in Kampala</h4>
                <p className="text-sm text-text-secondary">Order before 2pm for same-day delivery. Standard delivery is free for orders over UGX 50,000.</p>
              </div>
            </div>

            <div className="border-t border-border pt-6 text-sm text-text-muted">
              Sold by <strong>Dash Care Pharmacy</strong> · Licensed by NDA
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-16">
          <div className="flex border-b border-border overflow-x-auto hide-scrollbar">
            {['Overview', 'Usage & dosage', 'Side effects', 'Storage'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm whitespace-nowrap transition-colors relative ${
                  activeTab === tab ? 'text-primary-green' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-green rounded-t"></span>
                )}
              </button>
            ))}
          </div>
          <div className="py-8 text-text-secondary leading-relaxed bg-surface px-6 md:px-8 rounded-b-xl border border-t-0 border-border">
            {activeTab === 'Overview' && (
              <div className="space-y-4">
                <p>This product is a highly effective medication/supplement designed to provide quick and reliable results. It has been clinically tested and approved by relevant health authorities.</p>
                <p>Manufactured under strict quality control standards to ensure purity and potency. Always read the label before use.</p>
              </div>
            )}
            {activeTab === 'Usage & dosage' && (
              <div className="space-y-4">
                <p><strong>Adults:</strong> Take 1-2 units every 4-6 hours as needed. Do not exceed 8 units in 24 hours.</p>
                <p><strong>Children:</strong> Consult a doctor before use.</p>
                <p>Take with a full glass of water. Can be taken with or without food.</p>
              </div>
            )}
            {activeTab === 'Side effects' && (
              <div className="space-y-4">
                <p>Common side effects may include mild nausea, dizziness, or drowsiness. If any of these effects persist or worsen, contact your doctor or pharmacist promptly.</p>
                <p>Seek immediate medical attention if you notice any symptoms of a serious allergic reaction, including: rash, itching/swelling (especially of the face/tongue/throat), severe dizziness, trouble breathing.</p>
              </div>
            )}
            {activeTab === 'Storage' && (
              <div className="space-y-4">
                <p>Store at room temperature between 15-30°C (59-86°F).</p>
                <p>Keep away from light and moisture. Do not store in the bathroom.</p>
                <p>Keep all medications away from children and pets.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif text-text-primary mb-6">You may also like</h2>
            <div className="flex overflow-x-auto gap-6 pb-4 snap-x">
              {relatedProducts.map((p) => (
                <div key={p.id} className="min-w-[260px] md:min-w-[280px] snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
