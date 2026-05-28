'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Search, AlertTriangle, X, Upload, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  // Form state for add/edit product
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Pain Relief',
    description: '',
    price: '',
    originalPrice: '',
    stockQty: '',
    requiresPrescription: false,
    isActive: true
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Infinite Scroll State
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  const fetchProducts = async (pageIndex: number) => {
    try {
      const skip = pageIndex * LIMIT;
      const res = await fetch(`/api/products?limit=${LIMIT}&skip=${skip}`);
      const data = await res.json();

      if (data.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (pageIndex === 0) {
        setProducts(data);
      } else {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = data.filter((p: any) => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (page === 0) setLoading(true);
    else setLoadingMore(true);
    
    fetchProducts(page);
  }, [page]);

  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const lastElementRef = React.useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loading || loadingMore || searchQuery) return;
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      
      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, hasMore, searchQuery]
  );

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.slug) {
      alert("Please fill in the required fields: Name, Slug, and Price.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsAddPanelOpen(false);
        setFormData({
          name: '', slug: '', category: 'Pain Relief', description: '',
          price: '', originalPrice: '', stockQty: '', requiresPrescription: false, isActive: true
        });
        setPage(0);
        fetchProducts(0); // Refresh the list from the top
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save product.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const categories = ['Pain Relief', 'Vitamins', 'Antibiotics', 'Skincare', 'Baby & Mother', 'First Aid', 'Digestive Health', "Men's Health"];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-serif text-text-primary">Products ({products.length})</h1>
        <Button onClick={() => setIsAddPanelOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add new product
        </Button>
      </div>
      
      {/* Search */}
      <div className="bg-surface rounded-t-xl border border-border border-b-0 p-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm placeholder-text-muted focus:outline-none focus:border-primary-green"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface rounded-b-xl border border-border overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-background/50 text-text-muted border-b border-border">
            <tr>
              <th className="p-4 w-16">Image</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium text-center">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && page === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-green" /></td></tr>
            ) : filteredProducts.map((product, index) => {
              const isLastElement = index === filteredProducts.length - 1;
              return (
              <tr key={product.id} ref={isLastElement ? lastElementRef : null} className="hover:bg-background/50">
                <td className="p-4">
                  <div className="w-10 h-10 relative bg-background border border-border rounded overflow-hidden">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium text-text-primary">
                  <div className="flex items-center gap-2">
                    {product.name}
                    {product.requiresPrescription && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FEF3E8] text-[#B36B00]">Rx</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-text-secondary">{product.category}</td>
                <td className="p-4 font-mono font-medium">{formatPrice(product.price)}</td>
                <td className="p-4">
                  {product.stockQty !== undefined && product.stockQty < 10 ? (
                    <div className="flex items-center text-danger font-bold">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {product.stockQty}
                    </div>
                  ) : (
                    <span className="text-text-secondary">{product.stockQty}</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <div className="inline-flex items-center">
                    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${product.isActive !== false ? 'bg-primary-green' : 'bg-border'}`}>
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-surface transition-transform ${product.isActive !== false ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-3 text-sm font-medium">
                    <button className="text-primary-green hover:underline">Edit</button>
                    <button className="text-danger hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
              );
            })}
            {loadingMore && (
              <tr><td colSpan={7} className="p-4 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-primary-green" /></td></tr>
            )}
            {!hasMore && products.length > 0 && !searchQuery && (
              <tr><td colSpan={7} className="p-4 text-center text-xs text-text-muted">End of products</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Slide-in Panel */}
      {isAddPanelOpen && (
        <>
          <div className="fixed inset-0 bg-text-primary/50 z-50 transition-opacity" onClick={() => setIsAddPanelOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-surface shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-background/50">
              <h2 className="text-xl font-serif text-text-primary">Add New Product</h2>
              <button onClick={() => setIsAddPanelOpen(false)} className="p-2 text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Product name</label>
                  <input type="text" value={formData.name} onChange={handleNameChange} className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary-green" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Slug</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background text-text-muted font-mono text-sm focus:outline-none focus:border-primary-green" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary-green">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary-green resize-none"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Price (UGX)</label>
                    <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Original Price (optional)</label>
                    <input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary-green" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Stock quantity</label>
                    <input type="number" value={formData.stockQty} onChange={e => setFormData({...formData, stockQty: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:border-primary-green" />
                  </div>
                </div>

                <div className="border-t border-b border-border py-4 my-4 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.requiresPrescription ? 'bg-primary-green' : 'bg-border'}`}>
                      <input type="checkbox" className="sr-only" checked={formData.requiresPrescription} onChange={e => setFormData({...formData, requiresPrescription: e.target.checked})} />
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-surface transition-transform ${formData.requiresPrescription ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                    <span className="text-sm font-medium text-text-primary">Requires prescription</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.isActive ? 'bg-primary-green' : 'bg-border'}`}>
                      <input type="checkbox" className="sr-only" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-surface transition-transform ${formData.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                    <span className="text-sm font-medium text-text-primary">Active (visible on store)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Product Images</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center flex flex-col items-center justify-center bg-background cursor-pointer hover:bg-primary-light/50 transition-colors">
                    <Upload className="w-8 h-8 text-text-muted mb-2" />
                    <p className="text-sm font-medium text-text-primary">Click or drag images here</p>
                    <p className="text-xs text-text-muted mt-1">Maximum 4 images. First image will be the main image.</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 md:p-6 border-t border-border bg-background/50 flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsAddPanelOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSaveProduct} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Product
              </Button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
