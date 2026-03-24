import { Entry } from './types';

export function generateDemoData(): Entry[] {
  const now = new Date();
  const demoData: Entry[] = [];

  const createEntry = (
    type: 'income' | 'expense',
    category: string,
    amount: number,
    note: string,
    daysAgo: number
  ): Entry => {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return {
      id: `demo-${Date.now()}-${Math.random()}`,
      type,
      category,
      amount,
      note,
      date: date.toISOString().split('T')[0],
      createdAt: Date.now() - daysAgo * 24 * 60 * 60 * 1000,
    };
  };

  demoData.push(
    createEntry('income', 'Sales / Revenue', 85000, 'Market sales - Week 1', 75),
    createEntry('expense', 'Food & Groceries', 12500, 'Market shopping', 74),
    createEntry('expense', 'Transport', 3200, 'Taxi to market', 73),
    createEntry('income', 'Sales / Revenue', 92000, 'Market sales - Week 2', 68),
    createEntry('expense', 'Airtime & Data', 5000, 'MTN data bundle', 67),
    createEntry('expense', 'Food & Groceries', 15000, 'Home provisions', 65),
    createEntry('income', 'Freelance / Contract', 50000, 'Website design for client', 62),
    createEntry('expense', 'Transport', 4500, 'Fuel for week', 60),
    createEntry('income', 'Sales / Revenue', 78000, 'Market sales - Week 3', 54),
    createEntry('expense', 'Rent & Utilities', 45000, 'Monthly rent', 52),
    createEntry('expense', 'Business Supplies', 8500, 'Packaging materials', 50),
    createEntry('income', 'Sales / Revenue', 95000, 'Market sales - Week 4', 47),
    createEntry('expense', 'Entertainment', 6000, 'Cinema with family', 45),
    createEntry('expense', 'Food & Groceries', 18000, 'Monthly groceries', 42),
    createEntry('income', 'Transfer Received', 25000, 'Gift from uncle', 40),
    createEntry('income', 'Sales / Revenue', 88000, 'Market sales - Week 1', 35),
    createEntry('expense', 'Transport', 5200, 'Keke + bus fares', 34),
    createEntry('expense', 'Airtime & Data', 3000, 'Airtime top-up', 32),
    createEntry('income', 'Freelance / Contract', 75000, 'Logo design project', 28),
    createEntry('expense', 'Healthcare', 12000, 'Pharmacy visit', 26),
    createEntry('income', 'Sales / Revenue', 102000, 'Market sales - Week 2', 24),
    createEntry('expense', 'Food & Groceries', 14000, 'Weekend market', 22),
    createEntry('expense', 'Clothing', 15000, 'New work clothes', 20),
    createEntry('income', 'Sales / Revenue', 96000, 'Market sales - Week 3', 17),
    createEntry('expense', 'Savings Deposit', 30000, 'Transfer to savings account', 15),
    createEntry('expense', 'Business Supplies', 6500, 'Stock purchase', 14),
    createEntry('income', 'Sales / Revenue', 110000, 'Market sales - Week 4', 10),
    createEntry('expense', 'Transport', 4800, 'Transport for week', 9),
    createEntry('income', 'Sales / Revenue', 98000, 'Market sales - Week 1', 5),
    createEntry('expense', 'Airtime & Data', 5500, 'Data + airtime bundle', 4),
    createEntry('expense', 'Food & Groceries', 16500, 'Groceries and household', 3),
    createEntry('income', 'Freelance / Contract', 60000, 'Social media management', 2),
    createEntry('expense', 'Entertainment', 8000, 'Birthday celebration', 1)
  );

  return demoData;
}
