import PixelBarChart from './charts/PixelBarChart';
import TrendLineChart from './charts/TrendLineChart';
import CategoryBlocks from './charts/CategoryBlocks';
import HeatmapCalendar from './charts/HeatmapCalendar';
import InsightCards from './charts/InsightCards';
import { useAppSettings } from '../context/AppSettingsContext';

function StatsPanel({ filteredRecords, monthRecords, monthMeta, stats }) {
  const { t } = useAppSettings();

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">{t('stats')}</p>
          <h2>{monthMeta.label}</h2>
        </div>
        <span className="tag">{filteredRecords.length} {t('visible')}</span>
      </div>

      <div className="stats-layout">
        <PixelBarChart data={stats.recentTrend} />
        <TrendLineChart data={stats.recentTrend} />
        <CategoryBlocks data={stats.categoryBreakdown} />
        <HeatmapCalendar data={stats.activityMap} title={t('monthlyActivity')} />
        <InsightCards insights={stats.insights} monthRecords={monthRecords} />
      </div>
    </section>
  );
}

export default StatsPanel;
