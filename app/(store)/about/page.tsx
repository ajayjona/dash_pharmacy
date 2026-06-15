import React from 'react';
import { Metadata } from 'next';
import { Target01Icon, Rocket01Icon } from 'hugeicons-react';

export const metadata: Metadata = {
  title: 'About Us | Dash Care Pharmacy',
  description: 'Health is more than medicine—it is peace of mind, confidence, and the ability to live life to the fullest.',
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-8 tracking-tight text-center md:text-left">About Us</h1>
        
        <div className="prose prose-lg text-text-secondary max-w-none space-y-6">
          <p className="text-xl md:text-2xl font-medium text-primary-green leading-relaxed">
            Health is more than medicine—it is peace of mind, confidence, and the ability to live life to the fullest. At Dash Care Pharmacy, we exist to help people achieve exactly that.
          </p>

          <p className="leading-relaxed">
            Founded with a passion for improving lives, Dash Care Pharmacy is dedicated to delivering high-quality healthcare products, trusted pharmaceutical services, and personalized support to every person who walks through our doors. We understand that every customer has unique health needs, and we are committed to serving them with professionalism, integrity, and genuine care.
          </p>

          <p className="leading-relaxed">
            Our approach combines modern healthcare solutions with a human touch. Whether you are seeking everyday wellness products, prescription medications, preventive healthcare support, or expert guidance, our team is committed to ensuring that you receive the care and attention you deserve.
          </p>

          <p className="leading-relaxed">
            At Dash Care Pharmacy, we believe that healthier communities are built one person, one family, and one life at a time. This belief drives our commitment to excellence, reliability, and service that goes beyond simply dispensing medication.
          </p>

          <p className="font-medium text-text-primary italic border-l-4 border-primary-green pl-6 py-2 bg-surface rounded-r-lg shadow-sm">
            Because your health deserves more than treatment—it deserves care, trust, and excellence.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-border pt-12">
            <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border">
              <h2 className="text-2xl font-serif text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary-green">
                  <Target01Icon className="w-6 h-6" />
                </span>
                Our Vision
              </h2>
              <p className="leading-relaxed text-text-secondary">
                To become a leading healthcare partner known for transforming lives through accessible, trusted, and innovative pharmaceutical care.
              </p>
            </div>

            <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border">
              <h2 className="text-2xl font-serif text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary-green">
                  <Rocket01Icon className="w-6 h-6" />
                </span>
                Our Mission
              </h2>
              <p className="leading-relaxed text-text-secondary">
                To provide exceptional healthcare solutions that empower individuals and communities to live healthier, happier, and more fulfilling lives.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-xl md:text-2xl font-serif text-primary-green font-bold bg-primary-light/50 inline-block px-8 py-5 rounded-2xl border border-primary-green/20 shadow-sm">
              Dash Care Pharmacy — Where Care Meets Excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
