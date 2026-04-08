import { useAppSettings } from '../../context/AppSettingsContext';

function PixelBarChart({ data }) {
  const { formatCurrency, t } = useAppSettings();
  const max = Math.max(...data.map((item) => item.amount), 1);

  return (
    <article className="mini-panel">
      <div className="mini-panel-head">
        <h3>{t('pixelBars')}</h3>
        <span>{t('sevenDayExpense')}</span>
      </div>

      <div className="pixel-bars">
        {data.map((item) => (
          <div key={item.date} className="pixel-bar-item" title={`${item.label}: ${formatCurrency(item.amount)}`}>
            <div className="pixel-stack">
              {Array.from({
                length: Math.max(1, Math.round((item.amount / max) * 8)),
              }).map((_, index) => (
                <span key={`${item.date}-${index}`} />
              ))}
            </div>
            <strong>{item.label}</strong>
            <small>{formatCurrency(item.amount)}</small>
          </div>
        ))}
      </div>
    </article>
  );
}

export default PixelBarChart;
