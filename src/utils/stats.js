import { ALL_CATEGORIES } from '../data/categories';
import { t } from './i18n';
import { formatWeekday, getMonthGrid, getRelativeDates } from './date';

export function getMonthlyRecords(records, monthKey) {
  return records.filter((record) => record.date.startsWith(monthKey));
}

export function getFilteredRecords(records, filters) {
  return records.filter((record) => {
    const matchedType = filters.type === 'all' || record.type === filters.type;
    const matchedCategory =
      filters.category === 'all' || record.category === filters.category;
    const matchedMonth = !filters.month || record.date.startsWith(filters.month);

    return matchedType && matchedCategory && matchedMonth;
  });
}

export function sumAmount(records, type) {
  return records
    .filter((record) => record.type === type)
    .reduce((total, record) => total + Number(record.amount), 0);
}

export function getRecentExpenseSeries(records, days = 7, language = 'en-US') {
  const dates = getRelativeDates(days);

  return dates.map((date) => ({
    date,
    label: formatWeekday(date, language),
    amount: records
      .filter((record) => record.type === 'expense' && record.date === date)
      .reduce((sum, record) => sum + record.amount, 0),
  }));
}

export function getCategoryBreakdown(records) {
  const expenseRecords = records.filter((record) => record.type === 'expense');
  const total = expenseRecords.reduce((sum, record) => sum + record.amount, 0);

  return ALL_CATEGORIES.map((category) => {
    const amount = expenseRecords
      .filter((record) => record.category === category)
      .reduce((sum, record) => sum + record.amount, 0);

    return {
      category,
      amount,
      ratio: total ? amount / total : 0,
    };
  })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function getBudgetStatus(monthExpense, budgetAmount) {
  const amount = Number(budgetAmount) || 0;

  if (!amount) {
    return {
      amount: 0,
      remaining: 0,
      progress: 0,
      overspent: false,
    };
  }

  const remaining = amount - monthExpense;
  const progress = Math.min((monthExpense / amount) * 100, 100);

  return {
    amount,
    remaining,
    progress,
    overspent: remaining < 0,
  };
}

export function getActivityMap(records, monthKey) {
  const dates = getMonthGrid(monthKey);
  const counts = records.reduce((accumulator, record) => {
    accumulator[record.date] = (accumulator[record.date] || 0) + 1;
    return accumulator;
  }, {});

  return dates.map((date) => ({
    date,
    count: date ? counts[date] || 0 : 0,
  }));
}

export function getInsights(records, language = 'en-US', displayCategory = (value) => value) {
  if (!records.length) {
    return [
      t(language, 'shareNoData'),
      language === 'zh-CN'
        ? '先记下一笔小支出，月度节奏就开始了。'
        : 'Start with one tiny expense to unlock the monthly rhythm.',
      language === 'zh-CN'
        ? '细小的记录，会慢慢拼出更清晰的生活图景。'
        : 'Small entries add up to a clearer picture of daily life.',
    ];
  }

  const expenseBreakdown = getCategoryBreakdown(records);
  const locale = language === 'zh-CN' ? 'zh-CN' : 'en-US';
  const dayMap = records.reduce((accumulator, record) => {
    const weekday = new Date(record.date).toLocaleDateString(locale, {
      weekday: 'long',
    });
    accumulator[weekday] = (accumulator[weekday] || 0) + 1;
    return accumulator;
  }, {});

  const topCategory = expenseBreakdown[0];
  const topWeekday = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0];
  const recordDays = new Set(records.map((record) => record.date)).size;

  if (language === 'zh-CN') {
    return [
      topCategory
        ? `这个月花得最多的是 ${displayCategory(topCategory.category)}。`
        : '这个月还没有支出分类，收入暂时是主角。',
      topWeekday
        ? `${topWeekday[0]} 是你最常记账的一天。`
        : '还没有形成每周模式，继续轻松记下去吧。',
      `你这个月一共在 ${recordDays} 天里留下了记录。`,
    ];
  }

  return [
    topCategory
      ? `Top spending lived in ${displayCategory(topCategory.category)} this month.`
      : 'No expense categories yet. Income is leading the story.',
    topWeekday
      ? `${topWeekday[0]} was your most active record day.`
      : 'No weekly pattern yet. Keep logging a little each day.',
    `You recorded activity on ${recordDays} different day${recordDays > 1 ? 's' : ''}.`,
  ];
}

export function getRecordStreak(records) {
  const uniqueDates = [...new Set(records.map((record) => record.date))].sort((a, b) =>
    b.localeCompare(a),
  );

  if (!uniqueDates.length) {
    return 0;
  }

  let streak = 0;
  let current = new Date();

  for (const dateString of uniqueDates) {
    const expected = current.toISOString().slice(0, 10);
    const previous = new Date(current);
    previous.setDate(current.getDate() - 1);

    if (
      dateString === expected ||
      (streak === 0 && dateString === previous.toISOString().slice(0, 10))
    ) {
      streak += 1;
      current = previous;
    } else if (dateString === previous.toISOString().slice(0, 10)) {
      streak += 1;
      current = previous;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateDashboardStats(
  records,
  monthKey,
  budget,
  language = 'en-US',
  displayCategory = (value) => value,
) {
  const monthRecords = getMonthlyRecords(records, monthKey);
  const monthExpense = sumAmount(monthRecords, 'expense');
  const monthIncome = sumAmount(monthRecords, 'income');
  const balance = monthIncome - monthExpense;
  const recentTrend = getRecentExpenseSeries(records, 7, language);
  const categoryBreakdown = getCategoryBreakdown(monthRecords);
  const budgetStatus = getBudgetStatus(monthExpense, budget.amount);
  const activityMap = getActivityMap(monthRecords, monthKey);
  const insights = getInsights(monthRecords, language, displayCategory);
  const topCategory = categoryBreakdown[0]?.category ?? 'Other';
  const topDay = [...recentTrend].sort((a, b) => b.amount - a.amount)[0];

  return {
    monthExpense,
    monthIncome,
    balance,
    recentTrend,
    categoryBreakdown,
    budgetStatus,
    activityMap,
    insights,
    topCategory,
    topDay,
  };
}
