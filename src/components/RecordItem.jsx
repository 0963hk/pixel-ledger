import { formatDate } from '../utils/date';
import { useAppSettings } from '../context/AppSettingsContext';

function RecordItem({ record, onDelete, onEdit }) {
  const { t, formatCurrency, categoryLabel, language } = useAppSettings();

  return (
    <article className="record-item">
      <div className="record-main">
        <div className={`record-type-pill ${record.type}`}>{t(record.type)}</div>
        <div>
          <h3>{categoryLabel(record.category)}</h3>
          <p>{record.note || t('noNote')}</p>
        </div>
      </div>

      <div className="record-meta">
        <strong>{formatCurrency(record.amount)}</strong>
        <span>{formatDate(record.date, language)}</span>
      </div>

      <div className="record-actions">
        <button className="mini-button" type="button" onClick={() => onEdit(record)}>
          {t('edit')}
        </button>
        <button className="mini-button danger" type="button" onClick={() => onDelete(record.id)}>
          {t('delete')}
        </button>
      </div>
    </article>
  );
}

export default RecordItem;
