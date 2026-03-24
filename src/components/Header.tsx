import { formatMonth } from '../utils';

interface HeaderProps {
  currentMonth: Date;
}

export function Header({ currentMonth }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-navy px-5 py-4 shadow-md">
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="font-syne text-2xl font-extrabold text-white">Naira</span>
          <span className="font-syne text-2xl font-extrabold text-gold">Track</span>
        </div>
        <p className="text-xs text-white/70 mt-0.5">Smart finance for everyone</p>
        <p className="text-sm text-white/90 mt-3 font-medium">{formatMonth(currentMonth)}</p>
      </div>
    </header>
  );
}
