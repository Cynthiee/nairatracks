import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm">
      <div className="bg-primary-green text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-80">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
