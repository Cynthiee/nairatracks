import { useMemo } from 'react';
import { Entry, CATEGORY_COLORS } from '../types';
import {
  calculateMonthTotals,
  formatCurrency,
  getLast6MonthsData,
  getExpenseBreakdown,
} from '../utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';

interface DashboardProps {
  entries: Entry[];
  currentMonth: Date;
}

const SAVINGS_TIPS = [
  'Try saving 20% of every income entry before spending the rest.',
  'Track every ₦50 — small leaks sink big ships.',
  'Consider setting aside money for FIRS before month-end.',
  'Review your spending weekly to stay on track.',
  'Build an emergency fund equal to 3 months of expenses.',
];

export function Dashboard({ entries, currentMonth }: DashboardProps) {
  const monthTotals = useMemo(
    () => calculateMonthTotals(entries, currentMonth),
    [entries, currentMonth]
  );

  const last6Months = useMemo(
    () => getLast6MonthsData(entries, currentMonth),
    [entries, currentMonth]
  );

  const expenseBreakdown = useMemo(
    () => getExpenseBreakdown(entries, currentMonth),
    [entries, currentMonth]
  );

  const randomTip = useMemo(() => {
    const prevMonthTotals = calculateMonthTotals(
      entries,
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
    const savedMore = monthTotals.balance > prevMonthTotals.balance;
    const diff = monthTotals.balance - prevMonthTotals.balance;

    if (savedMore && diff > 0) {
      return `You saved ${formatCurrency(diff)} more than last month — keep it up!`;
    }

    if (expenseBreakdown.length > 0) {
      const topCategory = expenseBreakdown[0];
      return `Your top spend this month is ${topCategory.name}. Is there room to cut?`;
    }

    return SAVINGS_TIPS[Math.floor(Math.random() * SAVINGS_TIPS.length)];
  }, [entries, currentMonth, monthTotals, expenseBreakdown]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-primary-pale-green rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-primary-light-green font-medium mb-1">Income</p>
          <p className="text-lg font-bold text-primary-green mb-0.5">
            {formatCurrency(monthTotals.income, true)}
          </p>
          <p className="text-xs text-muted">{monthTotals.incomeCount} entries</p>
        </div>

        <div className="bg-soft-pale-red rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-soft-red font-medium mb-1">Expenses</p>
          <p className="text-lg font-bold text-soft-red mb-0.5">
            {formatCurrency(monthTotals.expenses, true)}
          </p>
          <p className="text-xs text-muted">{monthTotals.expenseCount} entries</p>
        </div>

        <div
          className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${
            monthTotals.balance >= 0 ? 'border-primary-green' : 'border-soft-red'
          }`}
        >
          <p className="text-xs text-muted font-medium mb-1">Balance</p>
          <p
            className={`text-lg font-bold mb-0.5 ${
              monthTotals.balance >= 0 ? 'text-primary-green' : 'text-soft-red'
            }`}
          >
            {formatCurrency(Math.abs(monthTotals.balance), true)}
          </p>
          <div
            className={`text-xs font-medium flex items-center gap-1 ${
              monthTotals.balance >= 0 ? 'text-primary-green' : 'text-soft-red'
            }`}
          >
            {monthTotals.balance >= 0 ? (
              <>
                <TrendingUp className="w-3 h-3" />
                <span>surplus</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-3 h-3" />
                <span>deficit</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-syne text-base font-semibold text-navy mb-4">Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={last6Months} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#5A7060" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#5A7060"
              tickFormatter={(value) => `₦${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5EDE8',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="income" fill="#0E6B3E" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expenses" fill="#E07070" radius={[4, 4, 0, 0]} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-syne text-base font-semibold text-navy mb-4">Spending Breakdown</h3>
        {expenseBreakdown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-pale-green flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-primary-green" />
            </div>
            <p className="text-muted text-sm">Add expenses to see your breakdown</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expenseBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5EDE8',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {expenseBreakdown.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                    />
                    <span className="text-navy">{item.name}</span>
                  </div>
                  <span className="font-semibold text-navy">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="bg-gold-pale rounded-2xl p-5 border-l-4 border-gold shadow-sm">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-gold" />
          </div>
          <p className="text-sm text-navy leading-relaxed">{randomTip}</p>
        </div>
      </div>
    </div>
  );
}
