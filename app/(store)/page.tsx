import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Truck, 
  Shield, 
  Clock, 
  Upload, 
  ArrowRight, 
  BadgeCheck, 
  Lock, 
  Zap, 
  Thermometer, 
  Leaf, 
  FlaskConical, 
  Sparkles, 
  Baby, 
  Cross, 
  Activity, 
  User, 
  Search as SearchIcon, 
  ShoppingCart as CartIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/formatters';

const categories = [
  { name: 'Pain relief', icon: Thermometer, slug: 'pain-relief' },
  { name: 'Vitamins & supplements', icon: Leaf, slug: 'vitamins' },
  { name: 'Antibiotics', icon: FlaskConical, slug: 'antibiotics' },
  { name: 'Skincare', icon: Sparkles, slug: 'skincare' },
  { name: 'Baby & mother', icon: Baby, slug: 'baby-mother' },
  { name: 'First aid', icon: Cross, slug: 'first-aid' },
  { name: 'Digestive health', icon: Activity, slug: 'digestive' },
  { name: "Men's health", icon: User, slug: 'mens-health' },
];

export default async function HomePage() {
  const products = (await prisma.product.findMany({
    where: { isActive: true },
    take: 8,
  })).map(p => ({
    ...p,
    originalPrice: p.originalPrice ?? undefined,
    description: p.description ?? undefined,
    stockQty: p.stockQty ?? undefined,
  }));
  
  const bestSellers = products;
  const heroProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Section 1 - Hero */}
      <section className="bg-surface border-b border-border pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary-light px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse"></span>
                <span className="text-sm font-medium text-primary-green">Licensed Pharmacy · Kampala, Uganda</span>
              </div>
              
              <h1 className="text-4xl md:text-[52px] font-serif text-text-primary leading-[1.1] tracking-tight">
                Your medicines, <br className="hidden md:block"/>delivered to your door.
              </h1>
              
              <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
                Order prescription drugs, vitamins, and healthcare products online. Same-day delivery in Kampala.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button size="lg" className="w-full sm:w-auto">Shop now</Button>
                </Link>
                <Link href="/upload-prescription">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload prescription
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Truck className="w-5 h-5 text-primary-green" />
                  <span>Same-day delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Shield className="w-5 h-5 text-primary-green" />
                  <span>NDA licensed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Clock className="w-5 h-5 text-primary-green" />
                  <span>24hr support</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="bg-primary-light rounded-2xl p-6 lg:p-8">
                <div className="grid grid-cols-2 gap-4">
                  {heroProducts.map((p) => (
                    <div key={p.id} className="bg-surface p-3 rounded-xl shadow-sm border border-border flex flex-col items-center text-center">
                      <div className="relative w-20 h-20 mb-3">
                        <Image src={p.image} alt={p.name} fill className="object-contain" />
                      </div>
                      <h4 className="text-xs font-medium text-text-primary line-clamp-2 mb-1 h-8">{p.name}</h4>
                      <span className="text-xs font-mono font-bold text-primary-green">{formatPrice(p.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Category Quick-Picks */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-text-primary mb-8 text-center md:text-left">Shop by category</h2>
          <div className="flex overflow-x-auto md:grid md:grid-cols-4 lg:grid-cols-8 gap-4 pb-4 snap-x">
            {categories.map((c) => (
              <Link 
                key={c.name} 
                href={`/shop?category=${c.slug}`}
                className="flex flex-col items-center p-4 bg-surface rounded-xl border border-border hover:border-primary-green transition-colors min-w-[120px] snap-start group"
              >
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary-green mb-3 group-hover:scale-110 transition-transform">
                  <c.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-center text-text-secondary">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 - Featured Products */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-serif text-text-primary mb-2">Best sellers</h2>
            <p className="text-text-muted">Trusted by thousands of customers in Kampala.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/shop">
              <Button variant="outline" size="lg">
                View all products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4 - How It Works */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-text-primary mb-12 text-center">How Dash Care works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[1px] bg-border border-dashed border-t-2 z-0"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary-green text-surface flex items-center justify-center font-bold mb-4">1</div>
              <div className="w-20 h-20 bg-surface rounded-2xl flex items-center justify-center text-primary-green shadow-sm border border-border mb-6">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-3">Find your product</h3>
              <p className="text-text-secondary max-w-sm">Browse hundreds of medicines, vitamins, and healthcare products.</p>
            </div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary-green text-surface flex items-center justify-center font-bold mb-4">2</div>
              <div className="w-20 h-20 bg-surface rounded-2xl flex items-center justify-center text-primary-green shadow-sm border border-border mb-6">
                <CartIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-3">Add to cart & checkout</h3>
              <p className="text-text-secondary max-w-sm">Place your order and choose same-day or scheduled delivery.</p>
            </div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary-green text-surface flex items-center justify-center font-bold mb-4">3</div>
              <div className="w-20 h-20 bg-surface rounded-2xl flex items-center justify-center text-primary-green shadow-sm border border-border mb-6">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-3">We deliver to you</h3>
              <p className="text-text-secondary max-w-sm">Our riders bring your order straight to your door in Kampala.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 - Promotions Banner */}
      <section className="bg-primary-green py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-20">
            <h2 className="text-2xl md:text-3xl font-serif text-surface text-center md:text-left leading-tight">
              Get 10% off your first order.<br/>
              Use code <span className="text-accent font-mono bg-surface/10 px-2 py-1 rounded ml-1">DASHCARE10</span> at checkout.
            </h2>
            <Link href="/shop" className="shrink-0">
              <button className="bg-surface text-primary-green font-medium px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center">
                Shop now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6 - Trust & Compliance */}
      <section className="py-12 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-light rounded-lg text-primary-green shrink-0">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-text-primary mb-1">NDA Licensed</h4>
                <p className="text-sm text-text-secondary">Licensed by Uganda&apos;s National Drug Authority.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-light rounded-lg text-primary-green shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-text-primary mb-1">Authentic Products</h4>
                <p className="text-sm text-text-secondary">We source directly from certified suppliers.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-light rounded-lg text-primary-green shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-text-primary mb-1">Secure Payments</h4>
                <p className="text-sm text-text-secondary">MTN MoMo, Airtel Money, Visa and Mastercard.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-light rounded-lg text-primary-green shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-text-primary mb-1">Fast Delivery</h4>
                <p className="text-sm text-text-secondary">Same-day delivery within Kampala.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
