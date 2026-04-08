import { getToday } from '../utils/date';
import { useAppSettings } from '../context/AppSettingsContext';

function Header() {
  const { t } = useAppSettings();

  return (
    <header className="hero-card">
      <div>
        <p className="eyebrow">PIXEL LEDGER</p>
        <h1>{t('heroTitle')}</h1>
        <p className="hero-copy">{t('heroCopy')}</p>
      </div>
      <div className="hero-date-card">
        <span>{t('today')}</span>
        <strong>{getToday()}</strong>
      </div>
    </header>
  );
}

export default Header;
