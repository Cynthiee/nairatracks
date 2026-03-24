import { useMemo } from 'react';
import { Entry } from '../types';
import { calculateTaxData, getTaxBandForIncome, formatCurrency, exportToCSV } from '../utils';
import { AlertCircle, Download, ExternalLink } from 'lucide-react';

interface TaxProps {
  entries: Entry[];
  onShowToast: (message: string) => void;
}

const TAX_BANDS = [
  { range: 'First ₦300,000', rate: '7%' },
  { range: 'Next ₦300,000', rate: '11%' },
  { range: 'Next ₦500,000', rate: '15%' },
  { range: 'Next ₦500,000', rate: '19%' },
  { range: 'Next ₦1,600,000', rate: '21%' },
  { range: 'Above ₦3,200,000', rate: '24%' },
];

export function Tax({ entries, onShowToast }: TaxProps) {
  const taxData = useMemo(() => calculateTaxData(entries), [entries]);
  const currentBand = useMemo(
    () => getTaxBandForIncome(taxData.projectedAnnual),
    [taxData.projectedAnnual]
  );

  const currentYear = new Date().getFullYear();

  const handleExport = () => {
    exportToCSV(entries);
    onShowToast('CSV exported successfully');
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="bg-navy rounded-2xl p-6 shadow-lg text-white">
        <p className="text-xs uppercase tracking-wider text-white/70 mb-2">Estimated Annual Tax</p>
        <p className="font-syne text-4xl font-extrabold mb-1">{formatCurrency(taxData.annualTax)}</p>
        <p className="text-sm text-white/80 mb-4">Based on your {currentYear} income</p>

        <div className="h-2 bg-navy/50 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{
              width: `${Math.min(100, taxData.effectiveRate)}%`,
            }}
          />
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Year income recorded</span>
            <span className="font-semibold">{formatCurrency(taxData.totalYearIncome)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/80">Projected annual income</span>
            <span className="font-semibold">{formatCurrency(taxData.projectedAnnual)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/80">Monthly tax provision</span>
            <span className="font-semibold">{formatCurrency(taxData.monthlyProvision)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/80">Effective rate</span>
            <span className="font-semibold text-gold">{taxData.effectiveRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-syne text-base font-semibold text-navy mb-4">Nigeria PAYE Tax Bands</h3>
        <div className="space-y-1">
          {TAX_BANDS.map((band, index) => {
            const isActive = index === currentBand;
            return (
              <div
                key={index}
                className={`flex justify-between items-center px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gold-pale border-l-4 border-gold font-semibold'
                    : 'bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <span className={`text-sm ${isActive ? 'text-navy' : 'text-muted'}`}>
                  {band.range}
                </span>
                <span className={`text-sm font-semibold ${isActive ? 'text-gold' : 'text-navy'}`}>
                  {band.rate}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gold-pale rounded-2xl p-5 border border-gold/30 shadow-sm">
        <div className="flex gap-3 mb-3">
          <AlertCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
          <p className="text-sm text-navy leading-relaxed">
            This estimate uses simplified PAYE brackets for guidance only. For official filing, visit
            firs.gov.ng or consult a tax professional.
          </p>
        </div>
        <a
          href="https://www.firs.gov.ng"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold/80 transition-colors"
        >
          Visit FIRS
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <button
        onClick={handleExport}
        disabled={entries.length === 0}
        className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          entries.length === 0
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-primary-green border-2 border-primary-green hover:bg-primary-pale-green'
        }`}
      >
        <Download className="w-4 h-4" />
        Export CSV — FIRS / Bank Ready
      </button>
    </div>
  );
}
