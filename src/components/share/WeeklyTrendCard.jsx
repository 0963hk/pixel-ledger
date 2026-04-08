import { useAppSettings } from '../../context/AppSettingsContext';

function WeeklyTrendCard({ stats }) {
  const { t, formatCurrency } = useAppSettings();
  const total = stats.recentTrend.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="share-template-card">
      <h3>{t('weeklyTrend')}</h3>
      <p>{t('weeklyTrendDesc')}</p>
      <ul>
        <li>{t('totalSpend')}: {formatCurrency(total)}</li>
        <li>{t('peakDay')}: {stats.topDay?.label ?? '--'}</li>
        <li>{t('peakAmount')}: {formatCurrency(stats.topDay?.amount ?? 0)}</li>
        <li>{t('styleSoftPixels')}</li>
      </ul>
    </div>
  );
}

export default WeeklyTrendCard;
