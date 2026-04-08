import { useAppSettings } from '../../context/AppSettingsContext';

function MonthlyReportCard({ stats, monthRecords, monthLabel }) {
  const { t, formatCurrency, categoryLabel } = useAppSettings();

  return (
    <div className="share-template-card">
      <h3>{t('monthlySummary')}</h3>
      <p>{monthLabel} · {t('monthlySummaryDesc')}</p>
      <ul>
        <li>{t('monthExpenseLabel')}: {formatCurrency(stats.monthExpense)}</li>
        <li>{t('monthIncomeLabel')}: {formatCurrency(stats.monthIncome)}</li>
        <li>{t('balance')}: {formatCurrency(stats.balance)}</li>
        <li>{t('topCategory')}: {categoryLabel(stats.topCategory)}</li>
        <li>{t('totalRecords')}: {monthRecords.length}</li>
      </ul>
    </div>
  );
}

export default MonthlyReportCard;
