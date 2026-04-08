import { currencyOptions } from '../utils/i18n';
import { useAppSettings } from '../context/AppSettingsContext';

function SettingsPanel() {
  const { settings, updateSettings, t } = useAppSettings();

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">{t('settings')}</p>
          <h2>{t('languageAndCurrency')}</h2>
        </div>
        <span className="tag">{settings.language === 'zh-CN' ? 'CN' : 'EN'}</span>
      </div>

      <div className="settings-grid">
        <label>
          {t('language')}
          <select
            value={settings.language}
            onChange={(event) => updateSettings({ language: event.target.value })}
          >
            <option value="zh-CN">{t('chinese')}</option>
            <option value="en-US">{t('english')}</option>
          </select>
        </label>

        <label>
          {t('currency')}
          <select
            value={settings.currencyCode}
            onChange={(event) => {
              const selected = currencyOptions.find((item) => item.code === event.target.value);
              updateSettings({
                currencyCode: event.target.value,
                currencySymbol: selected?.symbol ?? settings.currencySymbol,
              });
            }}
          >
            {currencyOptions.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="settings-full">
          {t('customSymbol')}
          <input
            type="text"
            maxLength="4"
            value={settings.currencySymbol}
            onChange={(event) => updateSettings({ currencySymbol: event.target.value })}
            placeholder="¥"
          />
        </label>
      </div>

      <p className="helper">{t('customSymbolHint')}</p>
    </section>
  );
}

export default SettingsPanel;
