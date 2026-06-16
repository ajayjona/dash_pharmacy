'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, AlertTriangle, Truck, Zap, Upload, Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import { formatPrice } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const { items, total: subtotal } = useAppSelector(state => state.cart);
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [addressData, setAddressData] = useState({
    phone: '',
    street: '',
    district: 'Kampala Central',
    instructions: ''
  });

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');
  const [timeSlot, setTimeSlot] = useState('9am–11am');

  const requiresPrescription = items.some(item => item.product.requiresPrescription);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);

  const discount = 0; 
  const deliveryFee = deliveryOption === 'express' ? 15000 : (subtotal > 50000 ? 0 : 5000);
  const total = subtotal - discount + deliveryFee;

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted && !isLoading) {
      if (!isAuthenticated) {
        toast.error('Please sign in to continue with your order');
        router.push('/auth/login?callbackUrl=/checkout');
      } else if (items.length === 0) {
        router.push('/cart');
      } else {
        // Fetch addresses
        fetch('/api/addresses')
          .then(res => res.json())
          .then(data => {
            if (!data.error && Array.isArray(data)) {
              setSavedAddresses(data);
              if (data.length > 0) {
                setSelectedAddressId(data[0].id);
              } else {
                setShowNewAddressForm(true);
              }
            }
          })
          .catch(console.error);
      }
    }
  }, [isMounted, isAuthenticated, isLoading, items, router]);

  if (!isMounted || !isAuthenticated || items.length === 0) {
    return null;
  }

  const handleNext = async () => {
    if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as Step);
    else {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            addressId: showNewAddressForm ? null : selectedAddressId,
            addressData: showNewAddressForm ? addressData : null,
            deliveryFee,
            subtotal,
            total,
            deliveryOption
          })
        });

        if (!res.ok) {
          throw new Error('Failed to create order');
        }

        const order = await res.json();
        toast.success('Order placed successfully!');
        router.push(`/checkout/pay?orderId=${order.id}`);
      } catch (e) {
        console.error(e);
        toast.error('Failed to place order. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      
      {/* Progress Bar */}
      <div className="bg-surface border-b border-border sticky top-16 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-border -z-10 transform -translate-y-1/2"></div>
            
            <div className="absolute left-0 right-1/2 top-1/2 h-[2px] transform -translate-y-1/2 transition-all duration-500 origin-left -z-10" 
                 style={{ backgroundColor: '#1A6B4A', transform: `scaleX(${(currentStep - 1) / 2})` }}></div>

            {[
              { num: 1, label: 'Delivery address' },
              { num: 2, label: 'Delivery options' },
              { num: 3, label: 'Review order' }
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              
              return (
                <div key={step.num} className="flex flex-col items-center bg-surface px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isCompleted ? 'bg-primary-green text-surface' :
                    isActive ? 'bg-primary-green text-surface ring-4 ring-primary-light' :
                    'bg-background border-2 border-border text-text-muted'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span className={`text-xs font-medium mt-2 hidden sm:block ${isActive || isCompleted ? 'text-text-primary' : 'text-text-muted'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Content Form Area */}
          <div className="flex-1 max-w-3xl">
            
            {/* STEP 1: Address */}
            {currentStep === 1 && (
              <div className="bg-surface rounded-xl border border-border p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-serif text-text-primary mb-6">Delivery address</h2>
                
                {savedAddresses.length > 0 && !showNewAddressForm && (
                  <div className="mb-6 space-y-3">
                    {savedAddresses.map(addr => (
                      <label key={addr.id} className={`block relative p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-primary-green bg-primary-light/30 ring-1 ring-primary-green' : 'border-border hover:border-primary-green/50'}`}>
                        <div className="flex items-start gap-4">
                          <input type="radio" name="savedAddress" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1 w-4 h-4 text-primary-green" />
                          <div className="flex-1">
                            <p className="font-medium text-text-primary">{addr.street}</p>
                            <p className="text-sm text-text-secondary">{addr.district}</p>
                            <p className="text-sm text-text-secondary">{addr.phone}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                    <Button variant="outline" className="w-full mt-2" onClick={() => setShowNewAddressForm(true)}>
                      <Plus className="w-4 h-4 mr-2" /> Add a new address
                    </Button>
                  </div>
                )}

                {showNewAddressForm && (
                  <div className="mb-6">
                    {savedAddresses.length > 0 && (
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-text-primary">New Address</h3>
                        <button className="text-sm text-primary-green font-medium" onClick={() => setShowNewAddressForm(false)}>Cancel</button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-primary mb-1">Phone number</label>
                        <input type="tel" placeholder="+256 7XX XXX XXX" className="w-full px-4 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary-green" 
                               value={addressData.phone} onChange={e => setAddressData({...addressData, phone: e.target.value})}/>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-primary mb-1">Street address / Area</label>
                        <input type="text" className="w-full px-4 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary-green" 
                               value={addressData.street} onChange={e => setAddressData({...addressData, street: e.target.value})}/>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-primary mb-1">District</label>
                        <select className="w-full px-4 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary-green"
                                value={addressData.district} onChange={e => setAddressData({...addressData, district: e.target.value})}>
                          <option>Kampala Central</option>
                          <option>Makindye</option>
                          <option>Rubaga</option>
                          <option>Kawempe</option>
                          <option>Nakawa</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-primary mb-1">Delivery instructions (optional)</label>
                        <textarea rows={3} placeholder="E.g. Blue gate, apartment 4B..." className="w-full px-4 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary-green resize-none"
                                  value={addressData.instructions} onChange={e => setAddressData({...addressData, instructions: e.target.value})}></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {requiresPrescription && (
                  <div className="mb-8 p-4 bg-[#FEF3E8] border border-[#F4A820]/30 rounded-xl">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#B36B00] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-[#B36B00] mb-1">Prescription Required</h4>
                        <p className="text-sm text-[#B36B00] mb-3">One or more items in your cart require a prescription. Please upload it before completing your order.</p>
                        <Button variant={prescriptionUploaded ? "outline" : "primary"} size="sm" onClick={() => setPrescriptionUploaded(true)}>
                          {prescriptionUploaded ? <><Check className="w-4 h-4 mr-2"/> Uploaded</> : <><Upload className="w-4 h-4 mr-2"/> Upload prescription</>}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Button size="lg" className="w-full md:w-auto" onClick={handleNext}>
                  Continue to delivery options
                </Button>
              </div>
            )}

            {/* STEP 2: Delivery Options */}
            {currentStep === 2 && (
              <div className="bg-surface rounded-xl border border-border p-6 md:p-8 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-2xl font-serif text-text-primary mb-6">Delivery options</h2>
                
                <div className="space-y-4 mb-8">
                  <label className={`block relative p-4 border rounded-xl cursor-pointer transition-all ${deliveryOption === 'standard' ? 'border-primary-green bg-primary-light/30 ring-1 ring-primary-green' : 'border-border hover:border-primary-green/50'}`}>
                    <div className="flex items-start gap-4">
                      <input type="radio" name="delivery" checked={deliveryOption === 'standard'} onChange={() => setDeliveryOption('standard')} className="mt-1 w-4 h-4 text-primary-green" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-text-primary flex items-center gap-2"><Truck className="w-4 h-4"/> Standard delivery</span>
                          <span className="font-mono font-medium">{subtotal > 50000 ? 'Free' : 'UGX 5,000'}</span>
                        </div>
                        <p className="text-sm text-text-secondary">2–4 hours · Free for orders over UGX 50,000</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block relative p-4 border rounded-xl cursor-pointer transition-all ${deliveryOption === 'express' ? 'border-primary-green bg-primary-light/30 ring-1 ring-primary-green' : 'border-border hover:border-primary-green/50'}`}>
                    <div className="flex items-start gap-4">
                      <input type="radio" name="delivery" checked={deliveryOption === 'express'} onChange={() => setDeliveryOption('express')} className="mt-1 w-4 h-4 text-primary-green" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-text-primary flex items-center gap-2"><Zap className="w-4 h-4"/> Express delivery</span>
                          <span className="font-mono font-medium">UGX 15,000</span>
                        </div>
                        <p className="text-sm text-text-secondary">Within 1 hour</p>
                      </div>
                    </div>
                  </label>
                </div>

                {deliveryOption === 'standard' ? (
                  <div className="mb-8">
                    <h3 className="font-medium text-text-primary mb-3">Select a time slot</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {['9am–11am', '11am–1pm', '1pm–3pm', '3pm–5pm', '5pm–7pm', '7pm–9pm'].map((slot) => (
                        <button key={slot} onClick={() => setTimeSlot(slot)} className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${timeSlot === slot ? 'bg-primary-green text-surface border-primary-green' : 'bg-surface text-text-secondary border-border hover:border-primary-green'}`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 p-4 bg-primary-light rounded-lg text-primary-green font-medium text-sm">
                    Your rider will arrive within 1 hour of confirmation.
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={() => setCurrentStep(1)}>Back</Button>
                  <Button size="lg" className="flex-1 md:flex-none" onClick={handleNext}>
                    Continue to review
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Review */}
            {currentStep === 3 && (
              <div className="bg-surface rounded-xl border border-border p-6 md:p-8 animate-in fade-in slide-in-from-right-4">
                <h2 className="text-2xl font-serif text-text-primary mb-6">Review order</h2>
                
                <div className="space-y-6">
                  {/* Address Summary */}
                  <div className="p-4 bg-background rounded-lg border border-border relative">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-text-primary">Delivery address</h3>
                      <button className="text-sm font-medium text-primary-green hover:underline" onClick={() => setCurrentStep(1)}>Edit</button>
                    </div>
                    <div className="text-sm text-text-secondary">
                      {showNewAddressForm ? (
                        <>
                          <p>{addressData.phone || '+256 700 000000'}</p>
                          <p>{addressData.street || 'Plot 1, Example Street'}</p>
                          <p>{addressData.district || 'Kampala'}</p>
                        </>
                      ) : (
                        <>
                          {savedAddresses.filter(a => a.id === selectedAddressId).map(addr => (
                            <React.Fragment key={addr.id}>
                              <p>{addr.street}</p>
                              <p>{addr.district}</p>
                              <p>{addr.phone}</p>
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Delivery Summary */}
                  <div className="p-4 bg-background rounded-lg border border-border relative">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-text-primary">Delivery method</h3>
                      <button className="text-sm font-medium text-primary-green hover:underline" onClick={() => setCurrentStep(2)}>Edit</button>
                    </div>
                    <div className="text-sm text-text-secondary">
                      <p className="font-medium text-text-primary capitalize">{deliveryOption} Delivery</p>
                      <p>{deliveryOption === 'standard' ? `Time slot: ${timeSlot}` : 'Within 1 hour'}</p>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div>
                    <h3 className="font-bold text-text-primary mb-3">Order items</h3>
                    <div className="divide-y divide-border border border-border rounded-lg bg-background overflow-hidden">
                      {items.map(item => (
                        <div key={item.product.id} className="p-3 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 relative bg-surface rounded border border-border">
                              <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                            </div>
                            <span className="font-medium text-text-primary line-clamp-1">{item.quantity}x {item.product.name}</span>
                          </div>
                          <span className="font-mono text-text-secondary shrink-0 ml-4">{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex items-center gap-4">
                  <Button variant="ghost" onClick={() => setCurrentStep(2)}>Back</Button>
                  <Button size="lg" className="flex-1" onClick={handleNext} disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Place order'}
                  </Button>
                </div>
              </div>
            )}

          </div>

          {/* Right - Sticky Order Summary */}
          <div className="w-full lg:w-[360px] shrink-0 hidden md:block">
            <div className="bg-surface rounded-xl border border-border p-6 sticky top-24 shadow-sm">
              <h2 className="text-lg font-serif text-text-primary mb-4">Order summary</h2>
              
              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery fee</span>
                  <span className="font-mono">{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-text-primary">Total</span>
                  <span className="text-xl font-mono font-bold text-primary-green">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
