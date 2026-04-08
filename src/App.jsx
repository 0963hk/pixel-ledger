import { useMemo, useState } from 'react';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import SummaryCard from './components/SummaryCard';
import BudgetCard from './components/BudgetCard';
import SettingsPanel from './components/SettingsPanel';
import FilterBar from './components/FilterBar';
import RecordList from './components/RecordList';
import StatsPanel from './components/StatsPanel';
import ExportPanel from './components/ExportPanel';
import ShareCardGenerator from './components/share/ShareCardGenerator';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from './data/categories';
import { useLedger } from './hooks/useLedger';
import { AppSettingsProvider } from './context/AppSettingsContext';
import {
  buildMonthOptions,
  getCurrentMonthKey,
  getToday,
  parseMonthKey,
} from './utils/date';
import {
  calculateDashboardStats,
  getFilteredRecords,
  getMonthlyRecords,
} from './utils/stats';
import { getCategoryLabel } from './utils/i18n';
import './styles/theme.css';
import './styles/app.css';

const emptyDraft = {
  amount: '',
  type: 'expense',
  category: EXPENSE_CATEGORIES[0],
  date: getToday(),
  note: '',
};

function App() {
  const {
    records,
    budget,
    settings,
    saveRecord,
    removeRecord,
    updateBudget,
    updateSettings,
    importSnapshot,
  } = useLedger();
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    month: getCurrentMonthKey(),
  });

  const monthOptions = useMemo(
    () => buildMonthOptions(records, settings.language),
    [records, settings.language],
  );

  const filteredRecords = useMemo(
    () => getFilteredRecords(records, filters),
    [records, filters],
  );

  const monthMeta = useMemo(
    () => parseMonthKey(filters.month, settings.language),
    [filters.month, settings.language],
  );

  const dashboardStats = useMemo(
    () =>
      calculateDashboardStats(
        records,
        filters.month,
        budget,
        settings.language,
        (category) => getCategoryLabel(category, settings.language),
      ),
    [records, filters.month, budget, settings.language],
  );

  const monthRecords = useMemo(
    () => getMonthlyRecords(records, filters.month),
    [records, filters.month],
  );

  const activeCategories =
    draft.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleDraftChange = (field, value) => {
    setDraft((current) => {
      if (field === 'type') {
        const nextCategories =
          value === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

        return {
          ...current,
          type: value,
          category: nextCategories[0],
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedAmount = Number(draft.amount);

    if (!normalizedAmount || normalizedAmount < 0) {
      return;
    }

    saveRecord({
      id: editingId ?? undefined,
      amount: normalizedAmount,
      type: draft.type,
      category: draft.category,
      date: draft.date,
      note: draft.note.trim(),
    });

    setDraft({
      ...emptyDraft,
      date: getToday(),
    });
    setEditingId(null);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setDraft({
      amount: String(record.amount),
      type: record.type,
      category: record.category,
      date: record.date,
      note: record.note,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDraft({
      ...emptyDraft,
      date: getToday(),
    });
  };

  return (
    <AppSettingsProvider settings={settings} updateSettings={updateSettings}>
      <div className="app-shell">
        <div className="pixel-noise" />
        <Header />
        <main className="page-grid">
          <aside className="side-column">
            <ExpenseForm
              categories={activeCategories}
              draft={draft}
              editingId={editingId}
              onChange={handleDraftChange}
              onSubmit={handleSubmit}
              onCancelEdit={handleCancelEdit}
            />
            <BudgetCard
              budget={budget}
              spent={dashboardStats.monthExpense}
              onSaveBudget={updateBudget}
            />
            <SettingsPanel />
            <section className="summary-grid">
              <SummaryCard
                labelKey="monthlyExpense"
                value={dashboardStats.monthExpense}
                accent="expense"
              />
              <SummaryCard
                labelKey="monthlyIncome"
                value={dashboardStats.monthIncome}
                accent="income"
              />
              <SummaryCard
                labelKey="monthlyBalance"
                value={dashboardStats.balance}
                accent={dashboardStats.balance >= 0 ? 'balance' : 'expense'}
              />
            </section>
          </aside>

          <section className="main-column">
            <FilterBar
              filters={filters}
              monthOptions={monthOptions}
              onChange={setFilters}
            />
            <RecordList
              records={filteredRecords}
              onDelete={removeRecord}
              onEdit={handleEdit}
            />
            <StatsPanel
              monthRecords={monthRecords}
              filteredRecords={filteredRecords}
              monthMeta={monthMeta}
              stats={dashboardStats}
            />
            <ExportPanel
              records={records}
              budget={budget}
              settings={settings}
              onImport={importSnapshot}
            />
            <ShareCardGenerator
              monthKey={filters.month}
              stats={dashboardStats}
              monthRecords={monthRecords}
              allRecords={records}
            />
          </section>
        </main>
      </div>
    </AppSettingsProvider>
  );
}

export default App;
