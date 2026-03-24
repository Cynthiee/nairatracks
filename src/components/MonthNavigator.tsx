import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonth } from '../utils';

interface MonthNavigatorProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  disableNext?: boolean;
}

export function MonthNavigator({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  disableNext,
}: MonthNavigatorProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <button
        onClick={onPrevMonth}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Previous month"
      >
        <ChevronLeft className="w-5 h-5 text-navy" />
      </button>
      <div className="px-6 py-2 bg-white rounded-full shadow-sm border border-border">
        <span className="font-syne text-sm font-bold text-navy">{formatMonth(currentMonth)}</span>
      </div>
      <button
        onClick={onNextMonth}
        disabled={disableNext}
        className={`p-2 rounded-full transition-colors ${
          disableNext
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:bg-gray-100'
        }`}
        aria-label="Next month"
      >
        <ChevronRight className="w-5 h-5 text-navy" />
      </button>
    </div>
  );
}
