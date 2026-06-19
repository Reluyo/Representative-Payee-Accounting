import jsPDF from 'jspdf';
import type { DateRangeReport, Receipt } from '../types';
import { formatCurrency, formatDate, generateReferenceNumber } from './formatting';

async function receiptToBase64(receipt: Receipt): Promise<string | null> {
  if (receipt.blobData) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(receipt.blobData!);
    });
  }
  if (receipt.data?.startsWith('data:image')) return receipt.data;
  return null;
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export async function generateReportPDF(report: DateRangeReport, accountName: string): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Helper functions
  const toDate = (d: Date | string | number): Date => {
    const result = d instanceof Date ? d : new Date(d);
    return isNaN(result.getTime()) ? new Date() : result;
  };

  const addText = (text: string, size = 11, bold = false) => {
    pdf.setFontSize(size);
    pdf.setFont(undefined as unknown as string, bold ? 'bold' : 'normal');
    const lines = pdf.splitTextToSize(text, contentWidth) as string[];
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, margin, yPosition);
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
  pdf.setFont(undefined as unknown as string, 'bold');
  pdf.text('Representative Payee Accounting Statement', margin, yPosition);
  yPosition += 12;

  // Account and Date Info
  addText(`Account: ${accountName ?? 'Account'}`, 11, true);
  addText(`Period: ${formatDate(toDate(report.startDate), 'long')} to ${formatDate(toDate(report.endDate), 'long')}`, 11);
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
  const col3 = margin + 58;
  const col4 = margin + 95;
  const col5 = pageWidth - margin;

  pdf.setFont(undefined as unknown as string, 'bold');
  pdf.setFontSize(9);
  if (yPosition > pageHeight - 25) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.text('Ref', col1, yPosition);
  pdf.text('Date', col2, yPosition);
  pdf.text('Category', col3, yPosition);
  pdf.text('Description', col4, yPosition);
  pdf.text('Amount', col5, yPosition, { align: 'right' });
  yPosition += 5;

  addLine();

  pdf.setFont(undefined as unknown as string, 'normal');
  pdf.setFontSize(9);

  // Transactions
  const sortedTransactions = [...report.transactions].sort((a, b) => toDate(a.date).getTime() - toDate(b.date).getTime());
  sortedTransactions.forEach((tx, index) => {
    if (tx.type === 'expense') {
      if (yPosition > pageHeight - 15) {
        pdf.addPage();
        yPosition = 20;
      }

      const refNum = generateReferenceNumber(toDate(tx.date), index + 1);
      const dateStr = formatDate(toDate(tx.date));
      const amt = formatCurrency(tx.amount);

      pdf.text(refNum, col1, yPosition);
      pdf.text(dateStr, col2, yPosition);
      pdf.text(tx.category.substring(0, 18), col3, yPosition);
      pdf.text(tx.description.substring(0, 28), col4, yPosition);
      pdf.text(amt, col5, yPosition, { align: 'right' });
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

    for (let index = 0; index < report.receiptAppendix.length; index++) {
      const receipt = report.receiptAppendix[index];
      const receiptDate = receipt.uploadedDate ? toDate(receipt.uploadedDate) : new Date();
      const refNum = generateReferenceNumber(receiptDate, index + 1);

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

      const imgData = await receiptToBase64(receipt);
      if (imgData) {
        try {
          const dims = await getImageDimensions(imgData);
          const maxW = contentWidth;
          const maxH = 120;
          const scale = Math.min(maxW / dims.width, maxH / dims.height);
          const imgW = dims.width * scale;
          const imgH = dims.height * scale;

          if (yPosition + imgH > pageHeight - 15) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.addImage(imgData, 'JPEG', margin, yPosition, imgW, imgH);
          yPosition += imgH + 5;
        } catch (error) {
          console.error('Failed to add image to PDF', error);
        }
      }

      yPosition += 5;
    }
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
