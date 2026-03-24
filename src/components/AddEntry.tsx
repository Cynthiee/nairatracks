import { useState } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types';
import { addEntry } from '../utils';
import { ArrowRight } from 'lucide-react';

interface AddEntryProps {
  onEntryAdded: () => void;
  onShowToast: (message: string) => void;
}

export function AddEntry({ onEntryAdded, onShowToast }: AddEntryProps) {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !amount || parseFloat(amount) <= 0) {
      onShowToast('Please fill all required fields');
      return;
    }

    addEntry({
      type,
      category,
      amount: parseFloat(amount),
      note,
      date,
    });

    setCategory('');
    setAmount('');
    setNote('');
    onEntryAdded();
    onShowToast(`${type === 'income' ? 'Income' : 'Expense'} saved ✓`);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setType('income');
            setCategory('');
          }}
          className={`flex-1 py-3 px-6 rounded-xl font-syne font-bold text-sm transition-all ${
            type === 'income'
              ? 'bg-primary-green text-white shadow-md'
              : 'bg-white text-muted border border-border hover:border-primary-green'
          }`}
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => {
            setType('expense');
            setCategory('');
          }}
          className={`flex-1 py-3 px-6 rounded-xl font-syne font-bold text-sm transition-all ${
            type === 'expense'
              ? 'bg-soft-red text-white shadow-md'
              : 'bg-white text-muted border border-border hover:border-soft-red'
          }`}
        >
          Expense
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Category <span className="text-soft-red">*</span>
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-navy appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              required
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Amount <span className="text-soft-red">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy font-semibold">
              ₦
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={() => {
                if (amount) {
                  const formatted = parseFloat(amount).toFixed(2);
                  setAmount(formatted);
                }
              }}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-white text-navy focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              min="1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-2">Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-navy focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
            placeholder="e.g. market sales, bus fare, DSTV..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Date <span className="text-soft-red">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-navy focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-green text-white py-4 px-6 rounded-xl font-syne font-bold text-base hover:bg-primary-light-green transition-colors shadow-md flex items-center justify-center gap-2"
        >
          Save {type === 'income' ? 'Income' : 'Expense'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
