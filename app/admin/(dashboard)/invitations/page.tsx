'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Trash2, Send, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Invitation {
  id: string;
  email: string;
  token: string;
  role: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
  creator: { name: string; email: string };
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/admin/invitations');
      if (!res.ok) throw new Error('Failed to fetch invitations');
      const data = await res.json();
      setInvitations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    setIsSending(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send invitation');

      setSuccessMsg(`Invitation sent to ${newEmail}`);
      setNewEmail('');
      fetchInvitations();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleAction = async (id: string, action: 'revoke' | 'resend') => {
    try {
      const res = await fetch(`/api/admin/invitations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (!res.ok) throw new Error(`Failed to ${action} invitation`);

      setSuccessMsg(`Invitation ${action === 'revoke' ? 'revoked' : 'resent'} successfully`);
      fetchInvitations();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">Team Invitations</h1>
        <p className="text-text-secondary text-base mt-2">Invite new administrators and manage pending invitations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Invite Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col p-6">
            <h2 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-primary-green" />
              Invite New Admin
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm font-medium">
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm font-medium">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    placeholder="colleague@example.com"
                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-sm focus:outline-none focus:border-primary-green transition-colors"
                  />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isSending || !newEmail}>
                {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                Send Invitation
              </Button>
            </form>
          </div>
        </div>

        {/* Invitations List */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-background/50 flex justify-between items-center">
              <h2 className="font-semibold text-text-primary">Invitation History</h2>
              <span className="text-xs font-medium text-text-muted bg-border px-2 py-1 rounded-md">{invitations.length} total</span>
            </div>
            
            {isLoading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
              </div>
            ) : invitations.length === 0 ? (
              <div className="p-12 text-center text-text-muted">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No invitations have been sent yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-secondary uppercase bg-background/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Recipient</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Sent By</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((inv) => {
                      const isExpired = new Date(inv.expiresAt) < new Date();
                      
                      let statusBadge = null;
                      if (inv.used) {
                        statusBadge = <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 bg-success/10 text-success rounded-full"><CheckCircle2 className="w-3 h-3" /> Accepted</span>;
                      } else if (isExpired) {
                        statusBadge = <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 bg-danger/10 text-danger rounded-full"><XCircle className="w-3 h-3" /> Expired</span>;
                      } else {
                        statusBadge = <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 bg-warning/10 text-warning rounded-full"><Clock className="w-3 h-3" /> Pending</span>;
                      }

                      return (
                        <tr key={inv.id} className="hover:bg-background/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-text-primary">
                            {inv.email}
                            <div className="text-xs text-text-muted mt-1">Expires: {new Date(inv.expiresAt).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4">{statusBadge}</td>
                          <td className="px-6 py-4 text-text-secondary">{inv.creator.name}</td>
                          <td className="px-6 py-4 text-right">
                            {!inv.used && (
                              <div className="flex items-center justify-end gap-2">
                                {!isExpired && (
                                  <button onClick={() => handleAction(inv.id, 'resend')} className="p-2 text-primary-green hover:bg-primary-green/10 rounded-lg transition-colors" title="Resend Email">
                                    <Send className="w-4 h-4" />
                                  </button>
                                )}
                                <button onClick={() => handleAction(inv.id, 'revoke')} className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors" title="Revoke Access">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
