import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-primary-green/20 rounded-full blur-xl animate-pulse"></div>
        <Loader2 className="w-10 h-10 text-primary-green animate-spin relative z-10" />
      </div>
    </div>
  );
}
