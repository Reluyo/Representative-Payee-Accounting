import { useState, useCallback } from 'react';
import type { DateRangeReport, Receipt, Transaction } from '../types';
import { generateReportPDF } from '../utils/pdf';
import { generateReportCSV, downloadCSV } from '../utils/csv';
import { supabase } from '../db/supabase';

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

      const transactions: Transaction[] = [];
      for (const row of (data ?? [])) {
        const { data: receiptRows } = await supabase
          .from('receipts')
          .select('*')
          .eq('transaction_id', row.id);

        const receipts: Receipt[] = (receiptRows ?? []).map((r: Record<string, unknown>) => ({
          id: r.id as number,
          transactionId: r.transaction_id as number,
          referenceNumber: r.reference_number as string,
          fileName: r.file_name as string,
          fileType: r.file_type as string,
          fileSize: r.file_size as number,
          uploadedDate: new Date(r.uploaded_date as string),
          data: '',
          originalText: (r.original_text as string) || '',
          extractedFields: (r.extracted_fields as Record<string, unknown>) || {},
        }));

        transactions.push({
          id: row.id,
          accountId: row.account_id,
          date: new Date(row.date),
          amount: Number(row.amount),
          category: row.category,
          description: row.description,
          type: row.type as 'income' | 'expense',
          status: row.status as 'pending' | 'confirmed',
          receipts,
          aiExtractedData: row.ai_extracted_data ?? undefined,
        });
      }

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
