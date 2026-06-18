import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  vendor?: string;
  amount?: number;
  date?: string;
  items?: string[];
  confidence: number;
}

// Persistent worker — avoids re-loading the 10MB language model on every scan
let cachedWorker: Tesseract.Worker | null = null;

async function getWorker(): Promise<Tesseract.Worker> {
  if (!cachedWorker) {
    cachedWorker = await Tesseract.createWorker('eng');
  }
  return cachedWorker;
}

export async function scanReceiptImage(imageData: string | Blob): Promise<OCRResult> {
  try {
    const worker = await getWorker();
    const result = await worker.recognize(imageData);
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

  // Try to extract amount — prefer the value on a "total" line, fall back to largest
  const allAmounts = [...text.matchAll(/\$?\s?(\d+\.\d{2})/g)];
  if (allAmounts.length > 0) {
    const totalLineMatch = text.match(/(?:total|subtotal|amount\s*due|balance\s*due|grand\s*total)\s*[:\s]*\$?\s?(\d+\.\d{2})/i);
    if (totalLineMatch) {
      data.amount = parseFloat(totalLineMatch[1]);
    } else {
      const lines = text.split('\n');
      let totalAmount: number | null = null;
      for (const line of lines) {
        if (/total/i.test(line) && !/sub\s*total/i.test(line)) {
          const lineAmounts = [...line.matchAll(/\$?\s?(\d+\.\d{2})/g)];
          if (lineAmounts.length > 0) {
            totalAmount = parseFloat(lineAmounts[lineAmounts.length - 1][1]);
            break;
          }
        }
      }
      if (totalAmount !== null) {
        data.amount = totalAmount;
      } else {
        const values = allAmounts.map(m => parseFloat(m[1]));
        data.amount = Math.max(...values);
      }
    }
  } else {
    const simpleMatch = text.match(/\$?\s?(\d+)/);
    if (simpleMatch) data.amount = parseFloat(simpleMatch[1]);
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
