import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  vendor?: string;
  amount?: number;
  date?: string;
  items?: string[];
  confidence: number;
}

export async function scanReceiptImage(imageData: string | Blob): Promise<OCRResult> {
  try {
    const result = await Tesseract.recognize(imageData, 'eng');
    const text = result.data.text;
    const confidence = result.data.confidence / 100;

    const extractedData = extractReceiptData(text);

    return {
      text,
      ...extractedData,
      confidence,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to scan receipt. Please try again.');
  }
}

function extractReceiptData(text: string): Partial<OCRResult> {
  const lines = text.split('\n').filter(line => line.trim());
  const data: Partial<OCRResult> = {};

  // Try to extract vendor (usually first meaningful line)
  const vendorLine = lines.find(line => line.length > 5 && !line.match(/\d{2}[:/]\d{2}/));
  if (vendorLine) {
    data.vendor = vendorLine.trim();
  }

  // Try to extract amount (look for currency patterns)
  const amountMatch = text.match(/\$?\s?(\d+\.\d{2}|\d+)/);
  if (amountMatch) {
    data.amount = parseFloat(amountMatch[1]);
  }

  // Try to extract date (MM/DD/YYYY or MM-DD-YYYY patterns)
  const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
  if (dateMatch) {
    data.date = dateMatch[1];
  }

  // Extract items (lines with prices)
  const items: string[] = [];
  lines.forEach(line => {
    if (line.match(/\$?\d+\.\d{2}/) && line.length > 5) {
      items.push(line.trim());
    }
  });
  if (items.length > 0) {
    data.items = items.slice(0, 10);
  }

  return data;
}

export async function imageToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
