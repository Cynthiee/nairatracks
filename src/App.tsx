import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { MonthNavigator } from './components/MonthNavigator';
import { Dashboard } from './components/Dashboard';
import { AddEntry } from './components/AddEntry';
import { Records } from './components/Records';
import { Tax } from './components/Tax';
import { Toast } from './components/Toast';
import { DemoBanner } from './components/DemoBanner';
import { Entry } from './types';
import {
  loadEntries,
  saveEntries,
  getMonthKey,
  hasDismissedDemoBanner,
  dismissDemoBanner,
} from './utils';
import { generateDemoData } from './demoData';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDemoBanner, setShowDemoBanner] = useState(false);

  useEffect(() => {
    const loaded = loadEntries();
    if (loaded.length === 0) {
      const demoData = generateDemoData();
      saveEntries(demoData);
      setEntries(demoData);
      setShowDemoBanner(!hasDismissedDemoBanner());
    } else {
      setEntries(loaded);
    }
  }, []);

  const refreshEntries = () => {
    setEntries(loadEntries());
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    const now = new Date();
    if (getMonthKey(nextMonth) <= getMonthKey(now)) {
      setCurrentMonth(nextMonth);
    }
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return getMonthKey(currentMonth) === getMonthKey(now);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const handleDismissBanner = () => {
    dismissDemoBanner();
    setShowDemoBanner(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#F3F4F1] flex flex-col">
      <div className="w-full bg-soft-white flex-1 flex flex-col">
        <Header currentMonth={currentMonth} />

        <main className="w-full px-5 md:px-8 pt-6 pb-24 flex-1 overflow-y-auto max-w-[1200px] mx-auto">
          {showDemoBanner && <DemoBanner onDismiss={handleDismissBanner} />}

          {(activeTab === 'dashboard' || activeTab === 'records') && (
            <MonthNavigator
              currentMonth={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              disableNext={isCurrentMonth()}
            />
          )}

          {activeTab === 'dashboard' && (
            <Dashboard entries={entries} currentMonth={currentMonth} />
          )}

          {activeTab === 'add' && (
            <AddEntry onEntryAdded={refreshEntries} onShowToast={showToast} />
          )}

          {activeTab === 'records' && (
            <Records
              entries={entries}
              currentMonth={currentMonth}
              onEntryDeleted={refreshEntries}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'tax' && <Tax entries={entries} onShowToast={showToast} />}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}
      </div>
    </div>
  );
}

export default App;
