import { useEffect, useRef, useState } from 'react';
import { exportRecordsToCsv, exportSnapshotToJson, parseJsonFile } from '../utils/export';
import { useAppSettings } from '../context/AppSettingsContext';

function ExportPanel({ records, budget, settings, onImport }) {
  const { t } = useAppSettings();
  const fileRef = useRef(null);
  const [message, setMessage] = useState(t('exportHint'));

  useEffect(() => {
    setMessage(t('exportHint'));
  }, [t]);

  const handleImport = async (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    try {
      const snapshot = await parseJsonFile(file);
      onImport(snapshot);
      setMessage(t('importSuccess'));
    } catch (error) {
      setMessage(error.message || t('importFailed'));
    } finally {
      event.target.value = '';
    }
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">{t('export')}</p>
          <h2>{t('backupRestore')}</h2>
        </div>
        <span className="tag">{t('localFirst')}</span>
      </div>

      <div className="export-grid">
        <button className="pixel-button" type="button" onClick={() => exportRecordsToCsv(records)}>
          {t('exportCsv')}
        </button>
        <button
          className="pixel-button"
          type="button"
          onClick={() => exportSnapshotToJson(records, budget, settings)}
        >
          {t('exportJson')}
        </button>
        <button className="pixel-button ghost" type="button" onClick={() => fileRef.current?.click()}>
          {t('importJson')}
        </button>
      </div>

      <input
        ref={fileRef}
        className="sr-only"
        type="file"
        accept="application/json"
        onChange={handleImport}
      />

      <p className="helper">{message}</p>
    </section>
  );
}

export default ExportPanel;
