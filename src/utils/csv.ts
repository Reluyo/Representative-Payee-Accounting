import type { DateRangeReport } from '../types';
import { formatDate, generateReferenceNumber } from './formatting';

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toDate(d: Date | string | number): Date {
  const result = d instanceof Date ? d : new Date(d);
  return isNaN(result.getTime()) ? new Date() : result;
}

export function generateReportCSV(report: DateRangeReport, accountName: string): string {
  const lines: string[] = [];

  lines.push('Representative Payee Accounting Statement');
  lines.push(`Account,${escapeCSV(accountName)}`);
  lines.push(`Period,${formatDate(toDate(report.startDate), 'long')} to ${formatDate(toDate(report.endDate), 'long')}`);
  lines.push(`Generated,${formatDate(new Date(), 'long')}`);
  lines.push('');

  lines.push('SUMMARY');
  lines.push(`Total Income,${report.totalIncome.toFixed(2)}`);
  lines.push(`Total Expenses,${report.totalExpense.toFixed(2)}`);
  lines.push(`Net,${(report.totalIncome - report.totalExpense).toFixed(2)}`);
  lines.push('');

  lines.push('EXPENSE SUMMARY BY CATEGORY');
  lines.push('Category,Amount');
  Object.entries(report.summary).forEach(([category, amount]) => {
    lines.push(`${escapeCSV(category)},${amount.toFixed(2)}`);
  });
  lines.push('');

  lines.push('TRANSACTION DETAILS');
  lines.push('Ref,Date,Type,Category,Description,Amount,Has Receipt');
  const sorted = [...report.transactions].sort((a, b) => toDate(a.date).getTime() - toDate(b.date).getTime());
  sorted.forEach((tx, index) => {
    const ref = generateReferenceNumber(toDate(tx.date), index + 1);
    const date = formatDate(toDate(tx.date));
    const hasReceipt = tx.receipts && tx.receipts.length > 0 ? 'Yes' : 'No';
    lines.push(`="${ref}",${date},${tx.type},${escapeCSV(tx.category)},${escapeCSV(tx.description)},${tx.amount.toFixed(2)},${hasReceipt}`);
  });

  return lines.join('\n');
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
