export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Study',
  'Entertainment',
  'Rent',
  'Health',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Gift',
  'Part-time',
  'Refund',
  'Other',
];

export const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];
