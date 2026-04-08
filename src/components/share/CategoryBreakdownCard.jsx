import { useAppSettings } from '../../context/AppSettingsContext';

function CategoryBreakdownCard({ stats }) {
  const { t, formatCurrency, categoryLabel } = useAppSettings();

  return (
    <div className="share-template-card">
      <h3>{t('categoryBreakdown')}</h3>
      <p>{t('categoryDesc')}</p>
      <ul>
        <li>{t('totalSpend')}: {formatCurrency(stats.monthExpense)}</li>
        <li>{t('top1')}: {categoryLabel(stats.categoryBreakdown[0]?.category ?? 'Other')}</li>
        <li>{t('top2')}: {categoryLabel(stats.categoryBreakdown[1]?.category ?? 'Other')}</li>
        <li>{t('top3')}: {categoryLabel(stats.categoryBreakdown[2]?.category ?? 'Other')}</li>
      </ul>
    </div>
  );
}

export default CategoryBreakdownCard;
