export function formatCurrency(value, settings = {}) {
  const amount = Number(value) || 0;
  const locale = settings.language === 'zh-CN' ? 'zh-CN' : 'en-US';
  const currencyCode = settings.currencyCode || 'USD';

  if (settings.currencySymbol) {
    const number = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${settings.currencySymbol}${number}`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatAmount(value) {
  return Number(value || 0).toFixed(2);
}
