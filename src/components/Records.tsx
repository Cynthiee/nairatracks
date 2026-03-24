import { useState, useMemo } from 'react';
import { Entry, CATEGORY_EMOJI } from '../types';
import { getEntriesForMonth, formatCurrency, deleteEntry, exportToCSV } from '../utils';
import { X, Download, FileSpreadsheet } from 'lucide-react';

interface RecordsProps {
  entries: Entry[];
  currentMonth: Date;
  onEntryDeleted: () => void;
  onShowToast: (message: string) => void;
}

export function Records({ entries, currentMonth, onEntryDeleted, onShowToast }: RecordsProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const monthEntries = useMemo(() => {
    const filtered = getEntriesForMonth(entries, currentMonth);
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return b.createdAt - a.createdAt;
    });
  }, [entries, currentMonth]);

  const handleDeleteClick = (id: string) => {
    if (deleteConfirmId === id) {
      deleteEntry(id);
      onEntryDeleted();
      setDeleteConfirmId(null);
      onShowToast('Entry deleted');
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const handleExport = () => {
    exportToCSV(entries);
    onShowToast('CSV exported successfully');
  };

  return (
    <div className="space-y-4 pb-4">
      {monthEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-pale-green flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-10 h-10 text-primary-green" />
          </div>
          <p className="text-muted text-sm mb-1">No transactions this month</p>
          <p className="text-xs text-muted">Tap + to record one</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
          {monthEntries.map((entry) => {
            const isConfirming = deleteConfirmId === entry.id;
            const emoji = CATEGORY_EMOJI[entry.category] || '💰';
            const bgColor = entry.type === 'income' ? 'bg-primary-pale-green' : 'bg-soft-pale-red';

            return (
              <div
                key={entry.id}
                className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
                  isConfirming ? 'ring-2 ring-soft-red bg-soft-pale-red' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-lg">{emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-navy text-sm">{entry.category}</p>
                        {entry.note && (
                          <p className="text-xs text-muted mt-0.5 truncate">{entry.note}</p>
                        )}
                        <p className="text-xs text-muted mt-1">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <p
                          className={`font-bold text-sm ${
                            entry.type === 'income' ? 'text-primary-green' : 'text-soft-red'
                          }`}
                        >
                          {entry.type === 'expense' && '−'}
                          {formatCurrency(entry.amount)}
                        </p>
                        <button
                          onClick={() => handleDeleteClick(entry.id)}
                          className={`p-1 rounded-full transition-colors ${
                            isConfirming
                              ? 'bg-soft-red text-white'
                              : 'hover:bg-gray-100 text-muted hover:text-soft-red'
                          }`}
                          aria-label={isConfirming ? 'Confirm delete' : 'Delete entry'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="sticky bottom-20 pt-4">
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
    </div>
  );
}
