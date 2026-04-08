import { useAppSettings } from '../context/AppSettingsContext';

function SummaryCard({ labelKey, value, accent }) {
  const { t, formatCurrency } = useAppSettings();

  return (
    <article className={`summary-card summary-${accent}`}>
      <span>{t(labelKey)}</span>
      <strong>{formatCurrency(value)}</strong>
    </article>
  );
}

export default SummaryCard;
