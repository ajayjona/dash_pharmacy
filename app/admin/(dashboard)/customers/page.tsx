'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCustomers = () => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    if (!confirm(`Are you sure you want to make this user an ${newRole}?`)) return;

    setUpdatingId(id);
    try {
      const res = await fetch(`/api/customers/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update role");
        return;
      }
      
      const updatedUser = await res.json();
      setCustomers(customers.map(c => c.id === updatedUser.id ? { ...c, role: updatedUser.role } : c));
    } catch (e) {
      console.error(e);
      alert("Error updating role");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-serif text-text-primary">Manage Users & Staff</h1>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-surface rounded-t-xl border border-border border-b-0 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-64 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm placeholder-text-muted focus:outline-none focus:border-primary-green"
            placeholder="Search name or email..."
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-surface rounded-b-xl border border-border overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-background/50 text-text-muted border-b border-border">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Joined</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-green" /></td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-text-muted">No users found.</td></tr>
            ) : customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-background/50">
                <td className="p-4 font-medium">{customer.name}</td>
                <td className="p-4 text-text-secondary">{customer.email}</td>
                <td className="p-4 text-text-secondary">{customer.phone}</td>
                <td className="p-4 text-text-secondary">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {customer.role === 'ADMIN' ? (
                    <Badge variant="success" className="flex w-fit items-center gap-1"><ShieldCheck className="w-3 h-3"/> Admin</Badge>
                  ) : (
                    <Badge variant="neutral">Customer</Badge>
                  )}
                </td>
                <td className="p-4 text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={updatingId === customer.id}
                    onClick={() => toggleRole(customer.id, customer.role)}
                  >
                    {updatingId === customer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                     customer.role === 'ADMIN' ? 'Demote to Customer' : 'Promote to Admin'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
