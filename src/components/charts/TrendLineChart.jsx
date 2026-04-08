import { useAppSettings } from '../../context/AppSettingsContext';

function TrendLineChart({ data }) {
  const { formatCurrency, t } = useAppSettings();
  const width = 520;
  const height = 220;
  const padding = 24;
  const max = Math.max(...data.map((item) => item.amount), 1);

  const points = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / (Math.max(data.length - 1, 1));
    const y = height - padding - (item.amount / max) * (height - padding * 2);
    return { ...item, x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <article className="mini-panel">
      <div className="mini-panel-head">
        <h3>{t('trendLine')}</h3>
        <span>{t('dailyRhythm')}</span>
      </div>

      <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={t('trendLine')}>
        <path d={path} fill="none" stroke="#6e8764" strokeWidth="4" strokeLinecap="square" />
        {points.map((point) => (
          <g key={point.date}>
            <rect x={point.x - 5} y={point.y - 5} width="10" height="10" fill="#c9a86a" />
            <title>{`${point.label}: ${formatCurrency(point.amount)}`}</title>
          </g>
        ))}
      </svg>

      <div className="chart-legend">
        {data.map((point) => (
          <span key={point.date}>
            {point.label}: {formatCurrency(point.amount)}
          </span>
        ))}
      </div>
    </article>
  );
}

export default TrendLineChart;
