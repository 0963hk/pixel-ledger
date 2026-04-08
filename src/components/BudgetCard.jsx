import { useEffect, useState } from 'react';
import { useAppSettings } from '../context/AppSettingsContext';

function BudgetCard({ budget, spent, onSaveBudget }) {
  const { t, formatCurrency } = useAppSettings();
  const [value, setValue] = useState(budget.amount ? String(budget.amount) : '');
  const budgetAmount = Number(budget.amount) || 0;
  const remaining = budgetAmount - spent;
  const progress = budgetAmount ? Math.min((spent / budgetAmount) * 100, 100) : 0;
  const isOver = budgetAmount > 0 && spent > budgetAmount;

  useEffect(() => {
    setValue(budget.amount ? String(budget.amount) : '');
  }, [budget.amount]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSaveBudget(Number(value) || 0);
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">{t('budget')}</p>
          <h2>{t('monthlyLimit')}</h2>
        </div>
        <span className={`tag ${isOver ? 'danger' : ''}`}>{isOver ? t('over') : t('calm')}</span>
      </div>

      <form className="budget-form" onSubmit={handleSubmit}>
        <input
          min="0"
          step="0.01"
          type="number"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="500"
        />
        <button className="pixel-button" type="submit">
          {t('saveBudget')}
        </button>
      </form>

      <div className="budget-meta">
        <div>
          <span>{t('budget')}</span>
          <strong>{formatCurrency(budgetAmount)}</strong>
        </div>
        <div>
          <span>{t('remaining')}</span>
          <strong className={isOver ? 'danger-text' : ''}>
            {formatCurrency(remaining)}
          </strong>
        </div>
      </div>

      <div className="budget-track" aria-label="Budget progress">
        <div className={`budget-fill ${isOver ? 'is-over' : ''}`} style={{ width: `${progress}%` }} />
      </div>

      <p className={`helper ${isOver ? 'is-danger' : ''}`}>
        {budgetAmount
          ? isOver
            ? t('budgetExceeded')
            : t('withinBudget')
          : t('budgetHint')}
      </p>
    </section>
  );
}

export default BudgetCard;
