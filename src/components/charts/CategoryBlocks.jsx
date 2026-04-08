import { useAppSettings } from '../../context/AppSettingsContext';

function CategoryBlocks({ data }) {
  const { formatCurrency, t, categoryLabel } = useAppSettings();
  const total = data.reduce((sum, item) => sum + item.amount, 0) || 1;

  return (
    <article className="mini-panel">
      <div className="mini-panel-head">
        <h3>{t('categoryMix')}</h3>
        <span>{t('monthlyExpenseShort')}</span>
      </div>

      {data.length ? (
        <div className="category-list">
          {data.map((item) => (
            <div key={item.category} className="category-row">
              <div className="category-meta">
                <strong>{categoryLabel(item.category)}</strong>
                <span>{formatCurrency(item.amount)}</span>
              </div>
              <div className="category-track">
                <div style={{ width: `${(item.amount / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="helper">{t('noExpenseCategories')}</p>
      )}
    </article>
  );
}

export default CategoryBlocks;
