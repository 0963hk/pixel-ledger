import { useAppSettings } from '../context/AppSettingsContext';

function ExpenseForm({
  draft,
  categories,
  editingId,
  onChange,
  onSubmit,
  onCancelEdit,
}) {
  const { t, categoryLabel } = useAppSettings();
  const isInvalidAmount = draft.amount !== '' && Number(draft.amount) <= 0;

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">{t('quickEntry')}</p>
          <h2>{editingId ? t('editRecord') : t('addRecord')}</h2>
        </div>
        <span className="tag">{editingId ? t('editing') : t('fast')}</span>
      </div>

      <form className="ledger-form" onSubmit={onSubmit}>
        <div className="toggle-group">
          {['expense', 'income'].map((type) => (
            <button
              key={type}
              className={`toggle-chip ${draft.type === type ? 'is-active' : ''}`}
              type="button"
              onClick={() => onChange('type', type)}
            >
              {t(type)}
            </button>
          ))}
        </div>

        <label>
          {t('amount')}
          <input
            min="0"
            step="0.01"
            type="number"
            value={draft.amount}
            onChange={(event) => onChange('amount', event.target.value)}
            placeholder="12.80"
            required
          />
        </label>

        <label>
          {t('category')}
          <select
            value={draft.category}
            onChange={(event) => onChange('category', event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryLabel(category)}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t('date')}
          <input
            type="date"
            value={draft.date}
            onChange={(event) => onChange('date', event.target.value)}
          />
        </label>

        <label>
          {t('note')}
          <textarea
            rows="3"
            value={draft.note}
            onChange={(event) => onChange('note', event.target.value)}
            placeholder={t('notePlaceholder')}
          />
        </label>

        {isInvalidAmount ? (
          <p className="helper is-danger">{t('amountInvalid')}</p>
        ) : (
          <p className="helper">{t('formHelper')}</p>
        )}

        <div className="form-actions">
          <button className="pixel-button" type="submit">
            {editingId ? t('saveRecord') : t('addRecordButton')}
          </button>
          {editingId ? (
            <button className="pixel-button ghost" type="button" onClick={onCancelEdit}>
              {t('cancel')}
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default ExpenseForm;
