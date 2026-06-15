import jsPDF from 'jspdf';
import type { DateRangeReport } from '../types';
import { formatCurrency, formatDate, generateReferenceNumber } from './formatting';

export async function generateReportPDF(report: DateRangeReport, accountName: string): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Helper functions
  const addText = (text: string, size = 11, bold = false) => {
    pdf.setFontSize(size);
    pdf.setFont(undefined, bold ? 'bold' : 'normal');
    const lines = pdf.splitTextToSize(text, contentWidth) as string[];
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = 20;
      }
      (pdf.text as (text: string, x: number, y: number) => jsPDF)(line, margin, yPosition);
      yPosition += 7;
    });
  };

  const addLine = () => {
    if (yPosition > pageHeight - 15) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.setDrawColor(200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
  };

  // Title
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  (pdf.text as (text: string, x: number, y: number) => jsPDF)('Representative Payee Accounting Statement', margin, yPosition);
  yPosition += 12;

  // Account and Date Info
  addText(`Account: ${accountName ?? 'Account'}`, 11, true);
  addText(`Period: ${formatDate(report.startDate, 'long')} to ${formatDate(report.endDate, 'long')}`, 11);
  addText(`Generated: ${formatDate(new Date(), 'long')}`, 10);
  yPosition += 5;

  addLine();

  // Summary Section
  addText('SUMMARY', 12, true);
  addText(`Total Income: ${formatCurrency(report.totalIncome)}`, 11);
  addText(`Total Expenses: ${formatCurrency(report.totalExpense)}`, 11);
  addText(`Net: ${formatCurrency(report.totalIncome - report.totalExpense)}`, 11, true);
  yPosition += 5;

  // Category Breakdown
  addText('EXPENSE SUMMARY BY CATEGORY', 12, true);
  Object.entries(report.summary).forEach(([category, amount]) => {
    addText(`${category}: ${formatCurrency(amount)}`, 10);
  });
  yPosition += 5;

  // Transactions Table Header
  addLine();
  addText('TRANSACTION DETAILS', 12, true);

  const col1 = margin;
  const col2 = margin + 35;
  const col3 = margin + 60;
  const col4 = margin + 95;
  const col5 = margin + 120;

  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(9);
  if (yPosition > pageHeight - 25) {
    pdf.addPage();
    yPosition = 20;
  }

  const textFunc = pdf.text as (text: string, x: number, y: number) => jsPDF;
  textFunc('Ref', col1, yPosition);
  textFunc('Date', col2, yPosition);
  textFunc('Category', col3, yPosition);
  textFunc('Description', col4, yPosition);
  textFunc('Amount', col5, yPosition);
  yPosition += 5;

  addLine();

  pdf.setFont(undefined, 'normal');
  pdf.setFontSize(9);

  // Transactions
  const sortedTransactions = [...report.transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  sortedTransactions.forEach((tx, index) => {
    if (tx.type === 'expense') {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = 20;
      }

      const refNum = generateReferenceNumber(index);
      const dateStr = formatDate(new Date(tx.date));
      const amount = formatCurrency(tx.amount);
      const textFunc2 = pdf.text as (text: string, x: number, y: number, opts?: Record<string, unknown>) => jsPDF;

      textFunc2(refNum, col1, yPosition);
      textFunc2(dateStr, col2, yPosition);
      textFunc2(tx.category.substring(0, 12), col3, yPosition);
      textFunc2(tx.description.substring(0, 20), col4, yPosition);
      textFunc2(amount, col5, yPosition, { align: 'right' });
      yPosition += 5;
    }
  });

  // Receipt Appendix
  if (report.receiptAppendix.length > 0) {
    pdf.addPage();
    yPosition = 20;

    addLine();
    addText('RECEIPT APPENDIX', 12, true);
    addText('Supporting documents in transaction date order', 10);
    yPosition += 5;

    report.receiptAppendix.forEach((receipt, index) => {
      const refNum = generateReferenceNumber(index);

      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }

      addText(`${refNum} - ${receipt.fileName}`, 10, true);
      if (receipt.extractedFields.vendor) {
        addText(`Vendor: ${receipt.extractedFields.vendor}`, 9);
      }
      if (receipt.extractedFields.amount) {
        addText(`Amount: ${formatCurrency(receipt.extractedFields.amount)}`, 9);
      }
      if (receipt.extractedFields.date) {
        addText(`Date: ${receipt.extractedFields.date}`, 9);
      }
      yPosition += 5;

      // Try to add receipt image if available
      if (receipt.data && receipt.data.startsWith('data:image')) {
        try {
          if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = 20;
          }
          const maxWidth = contentWidth;
          const maxHeight = 50;
          pdf.addImage(receipt.data, 'JPEG', margin, yPosition, maxWidth, maxHeight);
          yPosition += maxHeight + 5;
        } catch (error) {
          console.error('Failed to add image to PDF', error);
        }
      }

      yPosition += 5;
    });
  }

  // Add notes if present
  if (report.notes) {
    pdf.addPage();
    yPosition = 20;
    addLine();
    addText('NOTES', 12, true);
    addText(report.notes, 10);
  }

  // Save the PDF
  pdf.save(`accounting_report_${new Date().getTime()}.pdf`);
}
