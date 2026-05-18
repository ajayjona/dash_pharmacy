'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, SlidersHorizontal, Printer, X } from 'lucide-react';
import { mockOrders } from '@/lib/mockData';
import { formatPrice } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [viewingOrder, setViewingOrder] = useState<typeof mockOrders[0] | null>(null);

  const tabs = ['All', 'Pending', 'Confirmed', 'Packing', 'Dispatched', 'Delivered', 'Cancelled'];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'confirmed': return <Badge variant="info">Confirmed</Badge>;
      case 'packing': return <Badge variant="warning">Packing</Badge>;
      case 'dispatched': return <Badge variant="success">Dispatched</Badge>;
      case 'delivered': return <Badge variant="success">Delivered</Badge>;
      case 'cancelled': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedOrders(mockOrders.map(o => o.id));
    else setSelectedOrders([]);
  };

  const toggleSelect = (id: string) => {
    if (selectedOrders.includes(id)) setSelectedOrders(selectedOrders.filter(o => o !== id));
    else setSelectedOrders([...selectedOrders, id]);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-serif text-text-primary">Manage Orders</h1>
        {selectedOrders.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Mark as packing</Button>
            <Button size="sm">Mark as dispatched</Button>
          </div>
        )}
      </div>
      
      {/* Filters and Search */}
      <div className="bg-surface rounded-t-xl border border-border border-b-0 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex overflow-x-auto w-full md:w-auto hide-scrollbar gap-2">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab ? 'bg-primary-green text-surface' : 'bg-background text-text-secondary hover:bg-border/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm placeholder-text-muted focus:outline-none focus:border-primary-green"
            placeholder="Search order # or customer..."
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface rounded-b-xl border border-border overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-background/50 text-text-muted border-b border-border">
            <tr>
              <th className="p-4 w-12 text-center">
                <input type="checkbox" className="rounded border-border text-primary-green focus:ring-primary-green" 
                       checked={selectedOrders.length === mockOrders.length && mockOrders.length > 0} onChange={toggleSelectAll} />
              </th>
              <th className="p-4 font-medium">Order #</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Items</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-background/50">
                <td className="p-4 text-center">
                  <input type="checkbox" className="rounded border-border text-primary-green focus:ring-primary-green"
                         checked={selectedOrders.includes(order.id)} onChange={() => toggleSelect(order.id)} />
                </td>
                <td className="p-4 font-mono font-medium">{order.orderNumber}</td>
                <td className="p-4">{order.customer.name}</td>
                <td className="p-4 text-text-secondary">{order.customer.phone}</td>
                <td className="p-4 text-text-secondary">{order.items.length} items</td>
                <td className="p-4 font-mono font-medium">{formatPrice(order.total)}</td>
                <td className="p-4">{getStatusBadge(order.status)}</td>
                <td className="p-4 text-text-secondary">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-4 text-right">
                  <button className="text-primary-green hover:underline font-medium" onClick={() => setViewingOrder(order)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-in Order Details Drawer */}
      {viewingOrder && (
        <>
          <div className="fixed inset-0 bg-text-primary/50 z-50 transition-opacity" onClick={() => setViewingOrder(null)} />
          <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-surface shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-background/50">
              <h2 className="text-xl font-serif text-text-primary">Order {viewingOrder.orderNumber}</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 text-text-secondary hover:text-primary-green bg-surface rounded border border-border shadow-sm">
                  <Printer className="w-4 h-4" />
                </button>
                <button onClick={() => setViewingOrder(null)} className="p-2 text-text-secondary hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-xl bg-background">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Customer</h3>
                  <p className="font-medium text-sm">{viewingOrder.customer.name}</p>
                  <p className="text-sm text-text-secondary">{viewingOrder.customer.phone}</p>
                  <p className="text-sm text-text-secondary">{viewingOrder.customer.email}</p>
                </div>
                <div className="p-4 border border-border rounded-xl bg-background">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Status</h3>
                  <div className="mb-2">{getStatusBadge(viewingOrder.status)}</div>
                  <div className="text-xs text-text-muted">
                    {new Date(viewingOrder.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-text-primary mb-3">Delivery Address</h3>
                <div className="p-4 border border-border rounded-xl bg-surface text-sm text-text-secondary">
                  <p className="font-medium text-text-primary">{viewingOrder.deliveryAddress.name}</p>
                  <p>{viewingOrder.deliveryAddress.street}</p>
                  <p>{viewingOrder.deliveryAddress.district}</p>
                  {viewingOrder.deliveryAddress.instructions && (
                    <p className="mt-2 text-text-muted italic">Note: {viewingOrder.deliveryAddress.instructions}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-text-primary mb-3">Order Items</h3>
                <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                  {viewingOrder.items.map(item => (
                    <div key={item.productId} className="p-3 flex items-center gap-3 bg-surface">
                      <div className="w-12 h-12 relative bg-background border border-border rounded">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                        <p className="text-xs text-text-secondary">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <div className="font-mono text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-background/50 space-y-2 text-sm">
                    <div className="flex justify-between text-text-secondary">
                      <span>Subtotal</span>
                      <span className="font-mono">{formatPrice(viewingOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Delivery Fee</span>
                      <span className="font-mono">{formatPrice(viewingOrder.deliveryFee)}</span>
                    </div>
                    {viewingOrder.discount > 0 && (
                      <div className="flex justify-between text-primary-green">
                        <span>Discount</span>
                        <span className="font-mono">-{formatPrice(viewingOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                      <span className="font-bold text-text-primary">Total</span>
                      <span className="font-mono font-bold text-lg text-primary-green">{formatPrice(viewingOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-text-primary mb-3">Payment Info</h3>
                <div className="p-4 border border-border rounded-xl bg-surface text-sm flex justify-between items-center">
                  <div>
                    <span className="font-medium uppercase">{viewingOrder.paymentMethod.replace('_', ' ')}</span>
                    <Badge variant="success" className="ml-2">Paid</Badge>
                  </div>
                  <span className="font-mono text-text-muted text-xs">Ref: TXN-123456</span>
                </div>
              </div>

            </div>

            <div className="p-4 md:p-6 border-t border-border bg-background/50 flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-text-muted mb-1">Update Status</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface focus:outline-none focus:border-primary-green">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="packing">Packing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <Button>Update</Button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
