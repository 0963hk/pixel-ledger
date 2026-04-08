import { createContext, useContext, useMemo } from 'react';
import { formatCurrency as baseFormatCurrency } from '../utils/format';
import { getCategoryLabel, t as baseTranslate } from '../utils/i18n';

const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children, settings, updateSettings }) {
  const value = useMemo(
    () => ({
      settings,
      language: settings.language,
      t: (key) => baseTranslate(settings.language, key),
      formatCurrency: (value) => baseFormatCurrency(value, settings),
      categoryLabel: (category) => getCategoryLabel(category, settings.language),
      updateSettings,
    }),
    [settings, updateSettings],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider.');
  }

  return context;
}
