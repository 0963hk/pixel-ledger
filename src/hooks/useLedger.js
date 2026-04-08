import { useEffect, useState } from 'react';
import {
  createSnapshot,
  loadBudget,
  loadRecords,
  loadSettings,
  persistBudget,
  persistRecords,
  persistSettings,
  validateImportSnapshot,
} from '../utils/storage';

export function useLedger() {
  const [records, setRecords] = useState(() => loadRecords());
  const [budget, setBudget] = useState(() => loadBudget());
  const [settings, setSettings] = useState(() => loadSettings());

  useEffect(() => {
    persistRecords(records);
  }, [records]);

  useEffect(() => {
    persistBudget(budget);
  }, [budget]);

  useEffect(() => {
    persistSettings(settings);
  }, [settings]);

  const saveRecord = (record) => {
    setRecords((current) => {
      const now = new Date().toISOString();

      if (record.id) {
        return current.map((item) =>
          item.id === record.id
            ? {
                ...item,
                ...record,
                updatedAt: now,
              }
            : item,
        );
      }

      return [
        {
          ...record,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        },
        ...current,
      ];
    });
  };

  const removeRecord = (id) => {
    setRecords((current) => current.filter((item) => item.id !== id));
  };

  const updateBudget = (amount) => {
    setBudget({
      amount,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateSettings = (nextSettings) => {
    setSettings((current) => ({
      ...current,
      ...nextSettings,
    }));
  };

  const importSnapshot = (snapshot) => {
    const parsed = validateImportSnapshot(snapshot, settings.language);
    setRecords(parsed.records);
    setBudget(parsed.budget);
    setSettings(parsed.settings);
    return createSnapshot(parsed.records, parsed.budget, parsed.settings);
  };

  return {
    records,
    budget,
    settings,
    saveRecord,
    removeRecord,
    updateBudget,
    updateSettings,
    importSnapshot,
  };
}
