function getLocale(language = 'en-US') {
  return language === 'zh-CN' ? 'zh-CN' : 'en-US';
}

export function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

export function parseMonthKey(monthKey, language = 'en-US') {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  const monthFormatter = new Intl.DateTimeFormat(getLocale(language), {
    month: 'long',
    year: 'numeric',
  });

  return {
    label: monthFormatter.format(date),
    year,
    month,
  };
}

export function formatDate(value, language = 'en-US') {
  const dayFormatter = new Intl.DateTimeFormat(getLocale(language), {
    month: 'short',
    day: 'numeric',
  });
  return dayFormatter.format(new Date(value));
}

export function formatMonthLabel(monthKey, language = 'en-US') {
  return parseMonthKey(monthKey, language).label;
}

export function formatWeekday(value, language = 'en-US') {
  const weekdayFormatter = new Intl.DateTimeFormat(getLocale(language), {
    weekday: 'short',
  });
  return weekdayFormatter.format(new Date(value));
}

export function buildMonthOptions(records, language = 'en-US') {
  const uniqueMonths = new Set([getCurrentMonthKey()]);

  records.forEach((record) => {
    uniqueMonths.add(record.date.slice(0, 7));
  });

  return [...uniqueMonths]
    .sort((a, b) => b.localeCompare(a))
    .map((monthKey) => ({
      value: monthKey,
      label: formatMonthLabel(monthKey, language),
    }));
}

export function getDaysInMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}

export function getMonthGrid(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const totalDays = getDaysInMonth(monthKey);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells = [];

  for (let index = 0; index < startOffset; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(`${monthKey}-${String(day).padStart(2, '0')}`);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function getRelativeDates(days) {
  const result = [];
  const today = new Date();

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    result.push(date.toISOString().slice(0, 10));
  }

  return result;
}
