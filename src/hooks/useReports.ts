import { useState, useCallback } from 'react';
import { generateDateRangeReport } from '../db/queries';
import { generateReportPDF } from '../utils/pdf';
import { generateReportCSV, downloadCSV } from '../utils/csv';

export function useReports(accountId: number | null, accountName: string) {
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const generateReport = useCallback(async (startDate: Date, endDate: Date, notes: string = '') => {
    if (!accountId) return null;

    setReportLoading(true);
    setReportError(null);

    try {
      const report = await generateDateRangeReport(accountId, startDate, endDate, notes);
      return report;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate report';
      setReportError(message);
      throw error;
    } finally {
      setReportLoading(false);
    }
  }, [accountId]);

  const generateAndExportPDF = useCallback(async (startDate: Date, endDate: Date, notes: string = '') => {
    try {
      const report = await generateReport(startDate, endDate, notes);
      if (report) {
        await generateReportPDF(report, accountName);
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      throw error;
    }
  }, [generateReport, accountName]);

  const generateAndExportCSV = useCallback(async (startDate: Date, endDate: Date, notes: string = '') => {
    try {
      const report = await generateReport(startDate, endDate, notes);
      if (report) {
        const csv = generateReportCSV(report, accountName);
        downloadCSV(csv, `accounting_report_${Date.now()}.csv`);
      }
    } catch (error) {
      console.error('Failed to generate CSV:', error);
      throw error;
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
