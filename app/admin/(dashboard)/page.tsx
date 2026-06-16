import React from 'react';
import Link from 'next/link';
import OrderQuickUpdate from '@/components/admin/OrderQuickUpdate';
import { AlertTriangle, ArrowUpRight, RefreshCw } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function AdminDashboard() {
  const lowStockProducts = await prisma.product.findMany({
    where: { stockQty: { lt: 10 } },
    orderBy: { stockQty: 'asc' },
    take: 10
  });
  
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { customer: true }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayOrders = await prisma.order.findMany({
    where: { createdAt: { gte: today } }
  });
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  
  const pendingOrdersCount = await prisma.order.count({
    where: { status: 'pending' }
  });

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const sevenDaysAgo = last7Days[0];
  const last7DaysOrders = await prisma.order.findMany({
    where: { createdAt: { gte: sevenDaysAgo } }
  });

  const chartData = last7Days.map(date => {
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    const dayOrders = last7DaysOrders.filter(o => o.createdAt >= date && o.createdAt < nextDate);
    const rev = dayOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
      revenue: rev
    };
  });
  
  const maxRev = Math.max(...chartData.map(d => d.revenue), 100000);

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

  return (
    <div>
      <h1 className="text-2xl font-serif text-text-primary mb-6">Dashboard</h1>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface rounded-xl p-5 border border-border shadow-sm border-l-4 border-l-primary-green">
          <div className="text-sm text-text-secondary mb-1">Today&apos;s orders</div>
          <div className="text-3xl font-serif text-text-primary mb-2">{todayOrders.length}</div>
          <div className="flex items-center text-xs text-primary-green">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>Updated live</span>
          </div>
        </div>
        
        <div className="bg-surface rounded-xl p-5 border border-border shadow-sm border-l-4 border-l-primary-green">
          <div className="text-sm text-text-secondary mb-1">Today&apos;s revenue</div>
          <div className="text-2xl font-mono font-bold text-text-primary mb-2">{formatPrice(todayRevenue)}</div>
          <div className="flex items-center text-xs text-primary-green">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>Updated live</span>
          </div>
        </div>
        
        <div className="bg-surface rounded-xl p-5 border border-border shadow-sm border-l-4 border-l-[#F4A820]">
          <div className="text-sm text-text-secondary mb-1">Pending orders</div>
          <div className="text-3xl font-serif text-text-primary mb-2">{pendingOrdersCount}</div>
          <div className="flex items-center text-xs text-[#B36B00]">
            <AlertTriangle className="w-3 h-3 mr-1" />
            <span>Needs attention</span>
          </div>
        </div>
        
        <div className="bg-surface rounded-xl p-5 border border-border shadow-sm border-l-4 border-l-danger">
          <div className="text-sm text-text-secondary mb-1">Low stock alerts</div>
          <div className="text-3xl font-serif text-text-primary mb-2">{lowStockProducts.length}</div>
          <div className="flex items-center text-xs text-danger">
            <RefreshCw className="w-3 h-3 mr-1" />
            <span>Items to restock</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Area: Recent Orders & Chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Revenue Chart (Placeholder using CSS) */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-text-primary mb-6">Revenue (Last 7 Days)</h2>
            <div className="h-48 flex items-end justify-between gap-2">
              {chartData.map((data, i) => {
                const heightPercent = Math.max((data.revenue / maxRev) * 100, 2); // At least 2% height for visibility
                return (
                  <div key={i} className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-primary-green rounded-t-sm transition-all hover:bg-opacity-80 relative group" style={{ height: `${heightPercent}%` }}>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-text-primary text-surface text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {formatPrice(data.revenue)}
                      </div>
                    </div>
                    <span className="text-xs text-text-muted">{data.dayName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold text-text-primary">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-primary-green hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-background/50 text-text-muted">
                  <tr>
                    <th className="p-4 font-medium">Order #</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-background/50">
                      <td className="p-4 font-mono font-medium">{order.orderNumber}</td>
                      <td className="p-4">{order.customer.name}</td>
                      <td className="p-4 font-mono">{formatPrice(order.total)}</td>
                      <td className="p-4">{getStatusBadge(order.status)}</td>
                      <td className="p-4">
                        <OrderQuickUpdate orderId={order.id} currentStatus={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Panel: Low Stock */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl border border-border shadow-sm flex flex-col h-full max-h-[600px]">
            <div className="p-4 border-b border-border flex justify-between items-center bg-danger/5">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-danger" />
                Low Stock Alerts
              </h2>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 divide-y divide-border">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm">All products are adequately stocked.</div>
              ) : (
                lowStockProducts.map(product => (
                  <div key={product.id} className="py-3 first:pt-0 last:pb-0">
                    <h4 className="text-sm font-medium text-text-primary line-clamp-1 mb-1">{product.name}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-danger">{product.stockQty} in stock</span>
                      <Button variant="outline" size="sm" className="h-7 text-xs py-0 px-2">Update</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
