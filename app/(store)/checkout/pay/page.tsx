'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import { formatPrice } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';

function PaymentContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState<'cod' | 'mtn' | 'airtel' | 'card'>('cod');
  const [phone, setPhone] = useState('');
  const [cardName, setCardName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [countdown, setCountdown] = useState(60);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (user?.phone && !phone) setPhone(user.phone);
    if (user?.name && !cardName) setCardName(user.name);
  }, [user]);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => setOrderData(data))
        .catch(console.error);
    }
  }, [orderId]);

  const total = orderData?.total || 0;
  const orderNumber = orderData?.orderNumber || 'PENDING';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paymentStatus === 'processing' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (paymentStatus === 'processing' && countdown === 0) {
      setPaymentStatus('idle'); // Failed / timeout
    }
    return () => clearInterval(timer);
  }, [paymentStatus, countdown]);

  const handlePay = async () => {
    setPaymentStatus('processing');
    setCountdown(activeTab === 'cod' ? 2 : 60); // COD confirms quickly
    
    // Simulate successful payment after delay
    setTimeout(async () => {
      if (orderId) {
        await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            paymentStatus: activeTab === 'cod' ? 'pending' : 'paid',
            paymentMethod: activeTab
          })
        });
      }
      
      setPaymentStatus('success');
      setTimeout(() => {
        dispatch(clearCart());
        router.replace(`/orders/${orderId}/confirm`);
      }, 2000);
    }, activeTab === 'cod' ? 1000 : 4000);
  };

  return (
    <div className="bg-background min-h-[80vh] flex flex-col pt-12 pb-20">
      <div className="max-w-2xl mx-auto px-4 w-full">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-text-primary mb-2">Complete payment</h1>
          <p className="text-text-secondary">Choose your preferred payment method.</p>
        </div>

        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm mb-8">
          <div className="flex border-b border-border">
            <button 
              className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'cod' ? 'bg-primary-light text-primary-green border-b-2 border-primary-green' : 'text-text-muted hover:text-text-primary'}`}
              onClick={() => setActiveTab('cod')}
            >
              Cash on Delivery
            </button>
            <button 
              className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'mtn' ? 'bg-[#FFCC00]/10 text-[#FFCC00] border-b-2 border-[#FFCC00]' : 'text-text-muted hover:text-text-primary'}`}
              onClick={() => setActiveTab('mtn')}
            >
              MTN MoMo
            </button>
            <button 
              className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'airtel' ? 'bg-[#FF0000]/10 text-[#FF0000] border-b-2 border-[#FF0000]' : 'text-text-muted hover:text-text-primary'}`}
              onClick={() => setActiveTab('airtel')}
            >
              Airtel Money
            </button>
            <button 
              className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'card' ? 'bg-[#1A1F71]/10 text-[#1A1F71] border-b-2 border-[#1A1F71]' : 'text-text-muted hover:text-text-primary'}`}
              onClick={() => setActiveTab('card')}
            >
              Card
            </button>
          </div>

          <div className="p-6 md:p-8">
            {paymentStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary-green mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Order confirmed!</h3>
                <p className="text-text-secondary text-sm">Redirecting to your receipt...</p>
              </div>
            ) : paymentStatus === 'processing' ? (
              <div className="flex flex-col items-center justify-center py-8 animate-in fade-in">
                <Loader2 className="w-12 h-12 text-primary-green animate-spin mb-6" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  {activeTab === 'cod' ? 'Confirming order...' : 'Waiting for approval...'}
                </h3>
                {activeTab !== 'cod' && (
                  <>
                    <p className="text-text-secondary text-sm mb-6 text-center max-w-sm">
                      Please check your phone and enter your PIN to approve the payment prompt.
                    </p>
                    <div className="font-mono text-xl font-bold text-primary-green bg-primary-light px-4 py-2 rounded-lg mb-6">
                      00:{countdown.toString().padStart(2, '0')}
                    </div>
                  </>
                )}
                {countdown === 0 && activeTab !== 'cod' && (
                  <Button variant="outline" onClick={() => setPaymentStatus('idle')}>Try again</Button>
                )}
              </div>
            ) : (
              <div className="animate-in fade-in">
                
                {activeTab === 'mtn' && (
                  <div>
                    <div className="bg-[#FFCC00]/10 border border-[#FFCC00]/20 rounded-lg p-3 text-sm text-[#B38F00] font-medium mb-6">
                      A payment prompt will be sent to your MTN number.
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-text-primary mb-1">MTN phone number</label>
                      <input 
                        type="tel" 
                        placeholder="077X XXX XXX" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-[#FFCC00] focus:border-[#FFCC00]" 
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'airtel' && (
                  <div>
                    <div className="bg-[#FF0000]/10 border border-[#FF0000]/20 rounded-lg p-3 text-sm text-[#CC0000] font-medium mb-6">
                      A payment prompt will be sent to your Airtel number.
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-text-primary mb-1">Airtel phone number</label>
                      <input 
                        type="tel" 
                        placeholder="075X XXX XXX" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-[#FF0000] focus:border-[#FF0000]" 
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'card' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Card number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary-green font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">Expiry (MM/YY)</label>
                        <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary-green" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1">CVV</label>
                        <input type="text" placeholder="123" className="w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary-green" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Cardholder name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-1 focus:ring-primary-green" 
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'cod' && (
                  <div className="space-y-4 mb-6">
                    <div className="bg-primary-light/50 border border-primary-green/20 rounded-lg p-4 text-center">
                      <div className="inline-flex w-12 h-12 bg-white rounded-full items-center justify-center text-primary-green mb-3 shadow-sm">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-text-primary mb-1">Pay at your doorstep</h4>
                      <p className="text-sm text-text-secondary">
                        You can pay with cash or Mobile Money when your rider arrives with your order.
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <span className="text-text-secondary text-sm">Amount to pay:</span>
                  <div className="text-3xl font-mono font-bold text-text-primary mt-1">{formatPrice(total)}</div>
                </div>

                <Button size="lg" className="w-full" onClick={handlePay} disabled={total === 0}>
                  {activeTab === 'cod' ? 'Confirm order' : activeTab === 'card' ? `Pay ${formatPrice(total)}` : 'Pay now'}
                </Button>

              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
          <Lock className="w-4 h-4" />
          <span>256-bit SSL encryption · Secured by <strong>Flutterwave</strong></span>
        </div>

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <React.Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary-green" /></div>}>
      <PaymentContent />
    </React.Suspense>
  );
}
