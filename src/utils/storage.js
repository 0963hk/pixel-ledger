import { t } from './i18n';

const RECORDS_KEY = 'pixel-ledger-records';
const BUDGET_KEY = 'pixel-ledger-budget';
const SETTINGS_KEY = 'pixel-ledger-settings';
const APP_VERSION = '1.0.0';

const defaultBudget = {
  amount: 0,
  updatedAt: null,
};

const defaultSettings = {
  language: 'zh-CN',
  currencyCode: 'CNY',
  currencySymbol: '¥',
};

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

export function loadRecords() {
  return safeParse(localStorage.getItem(RECORDS_KEY), []);
}

export function persistRecords(records) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function loadBudget() {
  return safeParse(localStorage.getItem(BUDGET_KEY), defaultBudget);
}

export function persistBudget(budget) {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
}

export function loadSettings() {
  return {
    ...defaultSettings,
    ...safeParse(localStorage.getItem(SETTINGS_KEY), defaultSettings),
  };
}

export function persistSettings(settings) {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({
      ...defaultSettings,
      ...settings,
    }),
  );
}

export function createSnapshot(records, budget, settings = defaultSettings) {
  return {
    records,
    budget,
    settings,
    exportTime: new Date().toISOString(),
    appVersion: APP_VERSION,
  };
}

export function validateImportSnapshot(snapshot, language = 'en-US') {
  if (!snapshot || typeof snapshot !== 'object') {
    throw new Error(t(language, 'importErrorInvalid'));
  }

  if (!Array.isArray(snapshot.records)) {
    throw new Error(t(language, 'importErrorRecords'));
  }

  const budget = snapshot.budget && typeof snapshot.budget === 'object'
    ? {
        amount: Number(snapshot.budget.amount) || 0,
        updatedAt: snapshot.budget.updatedAt ?? null,
      }
    : defaultBudget;

  const records = snapshot.records
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      id: item.id ?? crypto.randomUUID(),
      type: item.type === 'income' ? 'income' : 'expense',
      category: item.category ?? 'Other',
      amount: Number(item.amount) || 0,
      date: item.date ?? new Date().toISOString().slice(0, 10),
      note: item.note ?? '',
      createdAt: item.createdAt ?? new Date().toISOString(),
      updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
    }));

  const settings = snapshot.settings && typeof snapshot.settings === 'object'
    ? {
        language: snapshot.settings.language === 'en-US' ? 'en-US' : 'zh-CN',
        currencyCode: snapshot.settings.currencyCode ?? defaultSettings.currencyCode,
        currencySymbol: snapshot.settings.currencySymbol ?? defaultSettings.currencySymbol,
      }
    : defaultSettings;

  return { records, budget, settings };
}

export { APP_VERSION, defaultSettings };
