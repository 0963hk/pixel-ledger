import RecordItem from './RecordItem';
import { useAppSettings } from '../context/AppSettingsContext';

function RecordList({ records, onDelete, onEdit }) {
  const { t } = useAppSettings();

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">{t('records')}</p>
          <h2>{t('recentLedger')}</h2>
        </div>
        <span className="tag">{records.length} {t('items')}</span>
      </div>

      {records.length ? (
        <div className="record-list">
          {records.map((record) => (
            <RecordItem
              key={record.id}
              record={record}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>{t('noRecords')}</h3>
          <p>{t('firstExpense')}</p>
        </div>
      )}
    </section>
  );
}

export default RecordList;
