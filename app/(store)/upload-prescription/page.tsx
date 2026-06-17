'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { FileText, MapPin, Phone, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UploadPrescriptionPage() {
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  const router = useRouter();
  
  const [prescriptionImage, setPrescriptionImage] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Kampala Central');
  const [street, setStreet] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      toast.error('Please sign in to upload a prescription');
      router.push('/auth/login?callbackUrl=/upload-prescription');
    }
  }, [isMounted, isAuthenticated, isLoading, router]);

  if (!isMounted || !isAuthenticated) {
    return null; 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionImage) {
      toast.error('Please provide a prescription image');
      return;
    }
    if (!phone || !street) {
      toast.error('Please provide phone number and street address');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [],
          addressData: { phone, street, district, instructions: 'Standalone prescription request' },
          addressId: null, // Force new address creation for simplicity or use existing if matched
          deliveryFee: 0,
          subtotal: 0,
          total: 0,
          deliveryOption: 'standard',
          prescriptionImage
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit prescription');
      }

      toast.success('Prescription submitted! Our team will review it and contact you with a quote.');
      router.push('/cart');
    } catch (err) {
      console.error(err);
      toast.error('Error submitting prescription. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary-green mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif text-text-primary mb-2">Upload Prescription</h1>
          <p className="text-text-secondary">
            Upload your doctor&apos;s prescription. Our pharmacists will review it and provide a quote for your medication.
          </p>
        </div>

        <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-4 bg-primary-light/30 border-b border-border flex items-start gap-3">
            <Info className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
            <p className="text-sm text-text-primary">
              <span className="font-semibold">How it works:</span> Once you submit your prescription, our team will review it and add the required medications to your order. You will then receive a notification to review the price and complete the payment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            
            {/* Step 1: Image Upload */}
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-border flex items-center justify-center text-sm">1</span>
                Upload Document
              </h2>
              <div className="ml-8">
                <ImageUploader value={prescriptionImage} onChange={setPrescriptionImage} />
                <p className="text-xs text-text-muted mt-2">Clear photos of physical prescriptions or digital PDFs (converted to image) are accepted.</p>
              </div>
            </div>

            <hr className="border-border" />

            {/* Step 2: Delivery Details */}
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-border flex items-center justify-center text-sm">2</span>
                Contact & Delivery Info
              </h2>
              
              <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-text-muted" /> Phone Number
                  </label>
                  <input type="tel" required placeholder="+256 7XX XXX XXX" className="w-full px-4 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary-green bg-background" 
                         value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-text-muted" /> Area / District
                  </label>
                  <select className="w-full px-4 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary-green bg-background"
                          value={district} onChange={e => setDistrict(e.target.value)}>
                    <option>Kampala Central</option>
                    <option>Makindye</option>
                    <option>Rubaga</option>
                    <option>Kawempe</option>
                    <option>Nakawa</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-1">Street Address</label>
                  <input type="text" required placeholder="E.g. Plot 1, Example Street" className="w-full px-4 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary-green bg-background" 
                         value={street} onChange={e => setStreet(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="pt-6 ml-8">
              <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : 'Submit Prescription'}
              </Button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}
