'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { mockProducts } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';

const CATEGORIES = ['All', 'Pain Relief', 'Vitamins', 'Antibiotics', 'Skincare', 'Baby & Mother', 'First Aid', 'Digestive Health', "Men's Health"];
const ITEMS_PER_PAGE = 8;

export default function ShopPage() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [prescriptionOnly, setPrescriptionOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<number>(150000);
  const [sortBy, setSortBy] = useState<string>('Relevance');
  
  // Infinite scroll states
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    let result = mockProducts.filter((product) => {
      if (activeCategory !== 'All' && product.category !== activeCategory) return false;
      if (inStockOnly && !product.inStock) return false;
      if (prescriptionOnly && !product.requiresPrescription) return false;
      if (product.price > priceRange) return false;
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    // Apply sorting
    if (sortBy === 'Price: low to high') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: high to low') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Newest first') {
      result = [...result].sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [activeCategory, inStockOnly, prescriptionOnly, searchQuery, priceRange, sortBy]);

  // Reset pagination when any filter or sort option changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeCategory, inStockOnly, prescriptionOnly, searchQuery, priceRange, sortBy]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && visibleCount < filteredProducts.length && !isLoadingMore) {
          setIsLoadingMore(true);
          // Simulate loading latency for a smooth premium feel
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
            setIsLoadingMore(false);
          }, 800);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [visibleCount, filteredProducts.length, isLoadingMore]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Elegant pulse skeleton card for lazy loading
  const SkeletonCard = () => (
    <div className="bg-surface rounded-xl border border-border p-5 animate-pulse flex flex-col h-full justify-between">
      <div className="space-y-4">
        <div className="aspect-square w-full rounded-lg bg-border/40"></div>
        <div className="h-3 bg-border/40 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-border/40 rounded w-5/6"></div>
          <div className="h-4 bg-border/40 rounded w-2/3"></div>
        </div>
      </div>
      <div className="space-y-3 pt-6">
        <div className="h-5 bg-border/40 rounded w-1/3"></div>
        <div className="h-10 bg-border/40 rounded w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Header & Filter Toggle */}
        <div className="flex md:hidden items-center justify-between mb-6">
          <h1 className="text-2xl font-serif text-text-primary">Shop</h1>
          <Button variant="outline" size="sm" onClick={() => setIsFiltersOpen(true)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar (Desktop) / Bottom Sheet (Mobile) */}
          <div className={`
            fixed inset-0 z-50 bg-surface md:bg-transparent md:static md:z-auto md:w-72 md:block shrink-0
            ${isFiltersOpen ? 'block' : 'hidden'}
          `}>
            {/* Mobile close button */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setIsFiltersOpen(false)}><X className="w-6 h-6 text-text-secondary" /></button>
            </div>
            
            <div className="p-4 md:p-0 space-y-8 h-full overflow-y-auto md:overflow-visible">
              
              <div>
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-text-muted" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-surface text-sm placeholder-text-muted focus:outline-none focus:border-primary-green"
                    placeholder="Search within results..."
                  />
                </div>
              </div>
              
              <div>
                <button className="flex items-center justify-between w-full mb-4">
                  <h3 className="font-bold text-text-primary">Category</h3>
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </button>
                <div className="space-y-3">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category"
                        checked={activeCategory === cat}
                        onChange={() => setActiveCategory(cat)}
                        className="w-4 h-4 accent-primary-green cursor-pointer"
                      />
                      <span className={`text-sm ${activeCategory === cat ? 'text-primary-green font-medium' : 'text-text-secondary group-hover:text-text-primary'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-bold text-text-primary mb-4">Price range</h3>
                <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="150000" 
                    step="5000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-primary-green mb-2 cursor-pointer" 
                  />
                  <div className="text-xs text-text-muted text-center font-mono">
                    UGX 0 — UGX {priceRange.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-bold text-text-primary mb-4">Availability</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="availability" checked={!inStockOnly} onChange={() => setInStockOnly(false)} className="w-4 h-4 accent-primary-green cursor-pointer" />
                    <span className="text-sm text-text-secondary">All products</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="availability" checked={inStockOnly} onChange={() => setInStockOnly(true)} className="w-4 h-4 accent-primary-green cursor-pointer" />
                    <span className="text-sm text-text-secondary">In stock only</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-bold text-text-primary mb-4">Type</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${prescriptionOnly ? 'bg-primary-green' : 'bg-border'}`}>
                    <input type="checkbox" className="sr-only" checked={prescriptionOnly} onChange={(e) => setPrescriptionOnly(e.target.checked)} />
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-surface transition-transform ${prescriptionOnly ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="text-sm text-text-secondary">Prescription only</span>
                </label>
              </div>

              <div className="border-t border-border pt-6 pb-20 md:pb-0 text-center">
                <button 
                  className="text-sm text-text-muted hover:text-primary-green underline"
                  onClick={() => {
                    setActiveCategory('All');
                    setInStockOnly(false);
                    setPrescriptionOnly(false);
                    setSearchQuery('');
                    setPriceRange(150000);
                    setSortBy('Relevance');
                  }}
                >
                  Clear all filters
                </button>
              </div>
              
              {/* Mobile apply button */}
              <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-surface border-t border-border">
                <Button className="w-full" onClick={() => setIsFiltersOpen(false)}>
                  Apply filters
                </Button>
              </div>

            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="hidden md:block mb-8">
              <h1 className="text-4xl font-serif text-text-primary">Shop</h1>
            </div>

            <div className="sticky top-16 md:top-24 z-20 bg-background/80 backdrop-blur-md py-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">
                  Showing {displayedProducts.length} of {filteredProducts.length} products
                </span>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  Sort by:
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 font-medium text-text-primary cursor-pointer focus:outline-none"
                  >
                    <option value="Relevance">Relevance</option>
                    <option value="Price: low to high">Price: low to high</option>
                    <option value="Price: high to low">Price: high to low</option>
                    <option value="Newest first">Newest first</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(activeCategory !== 'All' || inStockOnly || prescriptionOnly || priceRange < 150000) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {activeCategory !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface border border-border rounded-full text-xs font-medium text-text-secondary">
                      {activeCategory}
                      <button onClick={() => setActiveCategory('All')}><X className="w-3 h-3 hover:text-danger" /></button>
                    </span>
                  )}
                  {inStockOnly && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface border border-border rounded-full text-xs font-medium text-text-secondary">
                      In stock
                      <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3 hover:text-danger" /></button>
                    </span>
                  )}
                  {prescriptionOnly && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface border border-border rounded-full text-xs font-medium text-text-secondary">
                      Rx Only
                      <button onClick={() => setPrescriptionOnly(false)}><X className="w-3 h-3 hover:text-danger" /></button>
                    </span>
                  )}
                  {priceRange < 150000 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-surface border border-border rounded-full text-xs font-medium text-text-secondary">
                      Max: UGX {priceRange.toLocaleString()}
                      <button onClick={() => setPriceRange(150000)}><X className="w-3 h-3 hover:text-danger" /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-surface rounded-xl border border-border">
                <h3 className="text-lg font-medium text-text-primary mb-2">No products found</h3>
                <p className="text-text-muted mb-4">Try adjusting your filters or search query.</p>
                <Button variant="outline" onClick={() => { setActiveCategory('All'); setInStockOnly(false); setPrescriptionOnly(false); setSearchQuery(''); setPriceRange(150000); setSortBy('Relevance'); }}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                  
                  {/* Skeletons to fill standard columns while loading */}
                  {isLoadingMore && (
                    <>
                      <SkeletonCard />
                      <SkeletonCard />
                      <SkeletonCard />
                      <SkeletonCard />
                    </>
                  )}
                </div>

                {/* Observer target element at bottom */}
                <div ref={loadMoreRef} className="w-full flex flex-col items-center justify-center pt-10 pb-4">
                  {isLoadingMore && (
                    <div className="flex items-center gap-2 text-primary-green font-medium text-sm">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading products...</span>
                    </div>
                  )}
                  
                  {visibleCount >= filteredProducts.length && !isLoadingMore && (
                    <div className="text-center py-6 text-sm text-text-muted font-medium flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                      <span>You&apos;ve viewed all {filteredProducts.length} products</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
