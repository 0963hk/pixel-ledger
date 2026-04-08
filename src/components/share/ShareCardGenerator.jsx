import { useEffect, useMemo, useState } from 'react';
import { formatMonthLabel } from '../../utils/date';
import { generateShareImage } from '../../utils/shareImage';
import { useAppSettings } from '../../context/AppSettingsContext';
import MonthlyReportCard from './MonthlyReportCard';
import WeeklyTrendCard from './WeeklyTrendCard';
import CategoryBreakdownCard from './CategoryBreakdownCard';
import AchievementCard from './AchievementCard';

function ShareCardGenerator({ monthKey, stats, monthRecords, allRecords }) {
  const { t, settings } = useAppSettings();
  const [template, setTemplate] = useState('monthly');
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState(t('posterHint'));

  useEffect(() => {
    setMessage(t('posterHint'));
  }, [t]);

  const templateCards = {
    monthly: MonthlyReportCard,
    weekly: WeeklyTrendCard,
    category: CategoryBreakdownCard,
    achievement: AchievementCard,
  };

  const templateMeta = useMemo(
    () => [
      { key: 'monthly', title: t('monthlySummary'), desc: t('monthlySummaryDesc') },
      { key: 'weekly', title: t('weeklyTrend'), desc: t('weeklyTrendDesc') },
      { key: 'category', title: t('categoryBreakdown'), desc: t('categoryDesc') },
      { key: 'achievement', title: t('achievementBadge'), desc: t('achievementDesc') },
    ],
    [t],
  );

  const monthLabel = formatMonthLabel(monthKey, settings.language);
  const PreviewCard = templateCards[template];

  const handleGenerate = async () => {
    try {
      const image = await generateShareImage({
        template,
        monthLabel,
        stats,
        monthRecords,
        allRecords,
        settings,
      });
      setPreview(image);
      setMessage(t('generateSuccess'));
    } catch (error) {
      setPreview('');
      setMessage(error.message || t('shareNoData'));
    }
  };

  const handleDownload = () => {
    if (!preview) {
      setMessage(t('generateFirst'));
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = preview;
    anchor.download = `pixel-ledger-${template}-${monthKey}.png`;
    anchor.click();
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">{t('shareExportImage')}</p>
          <h2>{t('posterGenerator')}</h2>
        </div>
        <span className="tag">PNG</span>
      </div>

      <p className="helper panel-intro">{t('posterHint')}</p>

      <div className="share-layout">
        <div className="share-column share-select-column">
          <div className="share-section-title">{t('templatePicker')}</div>
          <div className="template-grid polished">
            {templateMeta.map((item) => (
              <button
                key={item.key}
                className={`template-button ${template === item.key ? 'is-active' : ''}`}
                type="button"
                onClick={() => setTemplate(item.key)}
              >
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="share-column share-meta-column">
          <div className="share-section-title">{t('posterDetails')}</div>
          <PreviewCard stats={stats} monthRecords={monthRecords} monthLabel={monthLabel} />
          <div className="share-actions">
            <button className="pixel-button" type="button" onClick={handleGenerate}>
              {t('generatePreview')}
            </button>
            <button className="pixel-button ghost" type="button" onClick={handleDownload}>
              {t('downloadPng')}
            </button>
          </div>
          <div className="share-message">{message}</div>
        </div>

        <div className="share-column share-preview-shell">
          <div className="share-section-title">{t('previewArea')}</div>
          <div className="share-preview">
            {preview ? (
              <img src={preview} alt="Share poster preview" />
            ) : (
              <div className="preview-placeholder">{t('noPreview')}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShareCardGenerator;
