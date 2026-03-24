import { X } from 'lucide-react';

interface DemoBannerProps {
  onDismiss: () => void;
}

export function DemoBanner({ onDismiss }: DemoBannerProps) {
  return (
    <div className="bg-gold-pale border border-gold/30 rounded-2xl p-4 mb-5 shadow-sm">
      <div className="flex gap-3">
        <span className="text-2xl flex-shrink-0">👋</span>
        <div className="flex-1">
          <p className="text-sm text-navy leading-relaxed">
            We added some sample data to get you started. Replace it with your own entries anytime.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gold hover:text-gold/80 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
