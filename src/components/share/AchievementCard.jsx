import { getRecordStreak } from '../../utils/stats';
import { useAppSettings } from '../../context/AppSettingsContext';

function AchievementCard({ monthRecords }) {
  const { t } = useAppSettings();
  const streak = getRecordStreak(monthRecords);
  const activeDays = new Set(monthRecords.map((record) => record.date)).size;

  return (
    <div className="share-template-card">
      <h3>{t('achievementBadge')}</h3>
      <p>{t('achievementDesc')}</p>
      <ul>
        <li>{t('currentStreak')}: {streak} {t('days')}</li>
        <li>{t('activeDaysThisMonth')}: {activeDays}</li>
        <li>{t('totalRecords')}: {monthRecords.length}</li>
        <li>{t('mood')}</li>
      </ul>
    </div>
  );
}

export default AchievementCard;
