import { useAppSettings } from '../../context/AppSettingsContext';

function HeatmapCalendar({ data, title }) {
  const { t } = useAppSettings();

  return (
    <article className="mini-panel">
      <div className="mini-panel-head">
        <h3>{title}</h3>
        <span>{t('recordHeat')}</span>
      </div>

      <div className="heatmap-grid">
        {data.map((cell, index) =>
          cell.date ? (
            <div
              key={cell.date}
              className={`heat-cell level-${Math.min(cell.count, 4)}`}
              title={`${cell.date}: ${cell.count}`}
            >
              <span>{cell.date.slice(-2)}</span>
            </div>
          ) : (
            <div key={`empty-${index}`} className="heat-cell empty" />
          ),
        )}
      </div>
    </article>
  );
}

export default HeatmapCalendar;
