export interface Entry {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  note: string;
  date: string;
  createdAt: number;
}

export const INCOME_CATEGORIES = [
  'Sales / Revenue',
  'Freelance / Contract',
  'Salary',
  'Rental Income',
  'Investment Return',
  'Transfer Received',
  'Other Income',
];

export const EXPENSE_CATEGORIES = [
  'Food & Groceries',
  'Transport',
  'Rent & Utilities',
  'Business Supplies',
  'Airtime & Data',
  'Healthcare',
  'Education',
  'Clothing',
  'Entertainment',
  'Savings Deposit',
  'Other Expense',
];

export const CATEGORY_EMOJI: Record<string, string> = {
  'Sales / Revenue': '💰',
  'Freelance / Contract': '💼',
  'Salary': '💵',
  'Rental Income': '🏠',
  'Investment Return': '📈',
  'Transfer Received': '📥',
  'Other Income': '💸',
  'Food & Groceries': '🛒',
  'Transport': '🚗',
  'Rent & Utilities': '🏘️',
  'Business Supplies': '📦',
  'Airtime & Data': '📱',
  'Healthcare': '🏥',
  'Education': '📚',
  'Clothing': '👔',
  'Entertainment': '🎬',
  'Savings Deposit': '🏦',
  'Other Expense': '💳',
};

export const CATEGORY_COLORS = [
  '#0E6B3E',
  '#16A05A',
  '#2E8B57',
  '#20B2AA',
  '#4682B4',
  '#5F9EA0',
  '#6B8E23',
  '#8B7355',
  '#C68B00',
  '#B8860B',
];
