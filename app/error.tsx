'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service like Sentry
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-xl border border-border text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-serif text-text-primary mb-3">
          Oops! Something went wrong
        </h2>
        
        <p className="text-text-secondary mb-8 leading-relaxed">
          We encountered an unexpected error. This is often just a temporary hiccup with our servers.
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()} 
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="w-full"
            size="lg"
          >
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
