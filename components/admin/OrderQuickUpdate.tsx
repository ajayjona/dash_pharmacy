'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OrderQuickUpdateProps {
  orderId: string;
  currentStatus: string;
}

export default function OrderQuickUpdate({ orderId, currentStatus }: OrderQuickUpdateProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (!newStatus) return;

    if (!confirm(`Are you sure you want to update this order's status to ${newStatus.toUpperCase()}?`)) {
      e.target.value = ''; // Reset dropdown to placeholder
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the status");
    } finally {
      setIsUpdating(false);
      e.target.value = ''; // Reset dropdown to placeholder after update
    }
  };

  return (
    <select 
      disabled={isUpdating}
      onChange={handleUpdate}
      defaultValue=""
      className="text-xs border border-border rounded px-2 py-1 bg-surface focus:outline-none focus:border-primary-green cursor-pointer disabled:opacity-50"
    >
      <option value="" disabled>Update...</option>
      <option value="pending">Pending</option>
      <option value="confirmed">Confirm</option>
      <option value="packing">Packing</option>
      <option value="dispatched">Dispatch</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
