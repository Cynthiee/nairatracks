import { Entry } from './types';

const STORAGE_KEY = 'nairatrack_v1';

export function formatCurrency(amount: number, abbreviate = false): string {
  if (abbreviate && amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  }
  return `₦${amount.toLocaleString('en-NG')}`;
}

export function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthFromKey(key: string): Date {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return getMonthKey(date1) === getMonthKey(date2);
}

export function loadEntries(): Entry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load entries:', error);
    return [];
  }
}

export function saveEntries(entries: Entry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save entries:', error);
  }
}

export function addEntry(entry: Omit<Entry, 'id' | 'createdAt'>): Entry {
  const entries = loadEntries();
  const newEntry: Entry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  entries.push(newEntry);
  saveEntries(entries);
  return newEntry;
}

export function deleteEntry(id: string): void {
  const entries = loadEntries();
  const filtered = entries.filter((e) => e.id !== id);
  saveEntries(filtered);
}

export function getEntriesForMonth(entries: Entry[], month: Date): Entry[] {
  const monthKey = getMonthKey(month);
  return entries.filter((e) => {
    const entryDate = new Date(e.date);
    return getMonthKey(entryDate) === monthKey;
  });
}

export function calculateMonthTotals(entries: Entry[], month: Date) {
  const monthEntries = getEntriesForMonth(entries, month);
  const income = monthEntries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  const expenses = monthEntries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = income - expenses;

  return {
    income,
    expenses,
    balance,
    incomeCount: monthEntries.filter((e) => e.type === 'income').length,
    expenseCount: monthEntries.filter((e) => e.type === 'expense').length,
  };
}

export function getLast6MonthsData(entries: Entry[], currentMonth: Date) {
  const months: Date[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1);
    months.push(date);
  }

  return months.map((month) => {
    const totals = calculateMonthTotals(entries, month);
    return {
      month: month.toLocaleDateString('en-US', { month: 'short' }),
      income: totals.income,
      expenses: totals.expenses,
    };
  });
}

export function getExpenseBreakdown(entries: Entry[], month: Date) {
  const monthEntries = getEntriesForMonth(entries, month).filter((e) => e.type === 'expense');
  const categoryMap = new Map<string, number>();

  monthEntries.forEach((entry) => {
    const current = categoryMap.get(entry.category) || 0;
    categoryMap.set(entry.category, current + entry.amount);
  });

  return Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function calcAnnualTax(annualIncome: number): number {
  if (annualIncome <= 0) return 0;
  const taxable = Math.max(0, annualIncome - 200000);
  const bands: [number, number][] = [
    [300000, 0.07],
    [300000, 0.11],
    [500000, 0.15],
    [500000, 0.19],
    [1600000, 0.21],
    [Infinity, 0.24],
  ];
  let tax = 0;
  let remaining = taxable;
  for (const [limit, rate] of bands) {
    if (remaining <= 0) break;
    const chunk = Math.min(remaining, limit);
    tax += chunk * rate;
    remaining -= chunk;
  }
  return Math.round(tax);
}

export function calculateTaxData(entries: Entry[]) {
  const currentYear = new Date().getFullYear();
  const yearEntries = entries.filter((e) => {
    const entryDate = new Date(e.date);
    return entryDate.getFullYear() === currentYear && e.type === 'income';
  });

  const totalYearIncome = yearEntries.reduce((sum, e) => sum + e.amount, 0);

  const monthsWithData = new Set(
    yearEntries.map((e) => getMonthKey(new Date(e.date)))
  ).size;

  const projectedAnnual =
    monthsWithData > 0 ? (totalYearIncome / monthsWithData) * 12 : 0;

  const annualTax = calcAnnualTax(projectedAnnual);
  const monthlyProvision = annualTax / 12;
  const effectiveRate = projectedAnnual > 0 ? (annualTax / projectedAnnual) * 100 : 0;

  return {
    annualTax,
    totalYearIncome,
    projectedAnnual,
    monthlyProvision,
    effectiveRate,
  };
}

export function getTaxBandForIncome(annualIncome: number): number {
  if (annualIncome <= 300000) return 0;
  if (annualIncome <= 600000) return 1;
  if (annualIncome <= 1100000) return 2;
  if (annualIncome <= 1600000) return 3;
  if (annualIncome <= 3200000) return 4;
  return 5;
}

export function exportToCSV(entries: Entry[]): void {
  const headers = ['Date', 'Type', 'Category', 'Amount (NGN)', 'Note'];
  const rows = entries
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => [
      e.date,
      e.type.charAt(0).toUpperCase() + e.type.slice(1),
      e.category,
      e.amount.toString(),
      `"${e.note.replace(/"/g, '""')}"`,
    ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  link.download = `nairatrack_export_${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function hasDismissedDemoBanner(): boolean {
  return localStorage.getItem('nairatrack_demo_dismissed') === 'true';
}

export function dismissDemoBanner(): void {
  localStorage.setItem('nairatrack_demo_dismissed', 'true');
}
