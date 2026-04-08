import { ALL_CATEGORIES } from '../data/categories';
import { useAppSettings } from '../context/AppSettingsContext';

function FilterBar({ filters, monthOptions, onChange }) {
  const { t, categoryLabel } = useAppSettings();

  const handleFieldChange = (field, value) => {
    onChange((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <section className="panel filter-panel">
      <div className="panel-heading compact">
        <div>
          <p className="panel-kicker">{t('filters')}</p>
          <h2>{t('viewRecords')}</h2>
        </div>
      </div>

      <div className="filter-grid">
        <label>
          {t('type')}
          <select
            value={filters.type}
            onChange={(event) => handleFieldChange('type', event.target.value)}
          >
            <option value="all">{t('all')}</option>
            <option value="expense">{t('expense')}</option>
            <option value="income">{t('income')}</option>
          </select>
        </label>

        <label>
          {t('category')}
          <select
            value={filters.category}
            onChange={(event) => handleFieldChange('category', event.target.value)}
          >
            <option value="all">{t('all')}</option>
            {ALL_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {categoryLabel(category)}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t('month')}
          <select
            value={filters.month}
            onChange={(event) => handleFieldChange('month', event.target.value)}
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

export default FilterBar;
