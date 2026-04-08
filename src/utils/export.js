import { APP_VERSION, createSnapshot } from './storage';

function escapeCsvCell(value) {
  const stringValue = String(value ?? '');
  const escaped = stringValue.replace(/"/g, '""');
  return /[",\n]/.test(stringValue) ? `"${escaped}"` : escaped;
}

function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportRecordsToCsv(records) {
  const header = ['id', 'type', 'category', 'amount', 'date', 'note', 'createdAt'];
  const lines = [
    header.join(','),
    ...records.map((record) =>
      [
        record.id,
        record.type,
        record.category,
        record.amount,
        record.date,
        record.note,
        record.createdAt,
      ]
        .map(escapeCsvCell)
        .join(','),
    ),
  ];

  const csvContent = `\uFEFF${lines.join('\n')}`;
  const fileName = `records-${new Date().toISOString().slice(0, 10)}.csv`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  triggerDownload(blob, fileName);
}

export function exportSnapshotToJson(records, budget, settings) {
  const snapshot = createSnapshot(records, budget, settings);
  const enrichedSnapshot = {
    ...snapshot,
    appVersion: APP_VERSION,
  };
  const blob = new Blob([JSON.stringify(enrichedSnapshot, null, 2)], {
    type: 'application/json;charset=utf-8;',
  });
  const fileName = `pixel-ledger-backup-${new Date().toISOString().slice(0, 10)}.json`;

  triggerDownload(blob, fileName);
}

export async function parseJsonFile(file) {
  const text = await file.text();
  return JSON.parse(text);
}
