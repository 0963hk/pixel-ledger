import { useAppSettings } from '../../context/AppSettingsContext';

function InsightCards({ insights, monthRecords }) {
  const { t } = useAppSettings();

  return (
    <article className="mini-panel insights-panel">
      <div className="mini-panel-head">
        <h3>{t('monthlyNotes')}</h3>
        <span>{monthRecords.length} {t('recordsCount')}</span>
      </div>

      <div className="insight-list">
        {insights.map((insight) => (
          <div key={insight} className="insight-card">
            {insight}
          </div>
        ))}
      </div>
    </article>
  );
}

export default InsightCards;
