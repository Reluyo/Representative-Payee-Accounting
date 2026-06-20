import { useState, useCallback } from 'react';
import type { DateRangeReport, Receipt, Transaction } from '../types';
import { generateReportPDF } from '../utils/pdf';
import { generateReportCSV, downloadCSV } from '../utils/csv';
import { supabase } from '../db/supabase';
import { fetchReceiptsForTransactions } from '../db/sync';

function buildReport(
  accountId: number,
  transactions: Transaction[],
  startDate: Date,
  endDate: Date,
  notes: string,
): DateRangeReport {
  const summary: Record<string, number> = {};
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(t => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
      summary[t.category] = (summary[t.category] || 0) + t.amount;
    }
  });

  const receiptAppendix: Receipt[] = transactions
    .filter(t => t.receipts && t.receipts.length > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .flatMap(t => t.receipts.map(r => ({ ...r, transactionId: t.id })));

  return {
    accountId,
    startDate,
    endDate,
    generatedDate: new Date(),
    transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    summary,
    totalIncome,
    totalExpense,
    notes,
    receiptAppendix,
  };
}

export function useReports(accountId: number | null, accountName: string) {
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const generateReport = useCallback(async (startDate: Date, endDate: Date, notes: string = '') => {
    if (!accountId) return null;

    setReportLoading(true);
    setReportError(null);

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', accountId)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString());

      if (error) throw error;

      const rows = data ?? [];
      const receiptsByTx = await fetchReceiptsForTransactions(rows.map(r => r.id));

      const transactions: Transaction[] = rows.map(row => ({
        id: row.id,
        accountId: row.account_id,
        date: new Date(row.date),
        amount: Number(row.amount),
        category: row.category,
        description: row.description,
        type: row.type as 'income' | 'expense',
        status: row.status as 'pending' | 'confirmed',
        receipts: receiptsByTx[row.id] ?? [],
        aiExtractedData: row.ai_extracted_data ?? undefined,
      }));

      return buildReport(accountId, transactions, startDate, endDate, notes);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate report';
      setReportError(message);
      throw error;
    } finally {
      setReportLoading(false);
    }
  }, [accountId]);

  const generateAndExportPDF = useCallback(async (startDate: Date, endDate: Date, notes: string = '') => {
    const report = await generateReport(startDate, endDate, notes);
    if (report) {
      await generateReportPDF(report, accountName);
    }
  }, [generateReport, accountName]);

  const generateAndExportCSV = useCallback(async (startDate: Date, endDate: Date, notes: string = '') => {
    const report = await generateReport(startDate, endDate, notes);
    if (report) {
      const csv = generateReportCSV(report, accountName);
      downloadCSV(csv, `accounting_report_${Date.now()}.csv`);
    }
  }, [generateReport, accountName]);

  return {
    reportLoading,
    reportError,
    generateReport,
    generateAndExportPDF,
    generateAndExportCSV,
  };
}
