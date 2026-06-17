import type { OCRResult } from './ocr';

const GEMINI_API_KEY_KEY = 'geminiApiKey';
const GEMINI_MODEL = 'gemini-2.0-flash';
const LOW_CONFIDENCE_THRESHOLD = 0.6;

export function getGeminiApiKey(): string {
  return localStorage.getItem(GEMINI_API_KEY_KEY) ?? '';
}

export function setGeminiApiKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem(GEMINI_API_KEY_KEY, key.trim());
  } else {
    localStorage.removeItem(GEMINI_API_KEY_KEY);
  }
}

export function isGeminiConfigured(): boolean {
  return getGeminiApiKey().length > 0;
}

export function isLowConfidence(result: OCRResult): boolean {
  const missingFields = (!result.vendor ? 1 : 0) + (!result.amount ? 1 : 0) + (!result.date ? 1 : 0);
  return result.confidence < LOW_CONFIDENCE_THRESHOLD || missingFields >= 2;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

async function callGemini(apiKey: string, prompt: string, imageBase64?: string): Promise<string> {
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  if (imageBase64) {
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch?.[1] ?? 'image/jpeg';
    parts.push({ inlineData: { mimeType, data: base64Data } });
  }

  parts.push({ text: prompt });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data: GeminiResponse = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

const EXTRACTION_PROMPT = `You are a receipt data extractor. Given the OCR text from a receipt, extract the following fields. Return ONLY a valid JSON object with no markdown formatting, no code fences, no explanation.

Fields:
- vendor: string (store/business name)
- amount: number (the total amount paid, not subtotal or tax)
- date: string in YYYY-MM-DD format
- category: string (one of: Medical/Healthcare, Food & Groceries, Housing & Rent, Utilities, Transportation, Personal Care, Entertainment, Other)
- items: string[] (line items if visible, max 10)

If a field cannot be determined, set it to null.

OCR text:
`;

const IMAGE_EXTRACTION_PROMPT = `You are a receipt data extractor. Look at this receipt image and extract the following fields. Return ONLY a valid JSON object with no markdown formatting, no code fences, no explanation.

Fields:
- vendor: string (store/business name)
- amount: number (the total amount paid, not subtotal or tax)
- date: string in YYYY-MM-DD format
- category: string (one of: Medical/Healthcare, Food & Groceries, Housing & Rent, Utilities, Transportation, Personal Care, Entertainment, Other)
- items: string[] (line items if visible, max 10)

If a field cannot be determined, set it to null.`;

export interface GeminiExtractionResult {
  vendor?: string;
  amount?: number;
  date?: string;
  category?: string;
  items?: string[];
}

function parseGeminiResponse(text: string): GeminiExtractionResult {
  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    return {
      vendor: parsed.vendor ?? undefined,
      amount: typeof parsed.amount === 'number' ? parsed.amount : undefined,
      date: parsed.date ?? undefined,
      category: parsed.category ?? undefined,
      items: Array.isArray(parsed.items) ? parsed.items : undefined,
    };
  } catch {
    return {};
  }
}

export async function extractWithGeminiText(ocrText: string): Promise<GeminiExtractionResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('Gemini API key not configured');

  const response = await callGemini(apiKey, EXTRACTION_PROMPT + ocrText);
  return parseGeminiResponse(response);
}

export async function extractWithGeminiImage(imageBase64: string): Promise<GeminiExtractionResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('Gemini API key not configured');

  const response = await callGemini(apiKey, IMAGE_EXTRACTION_PROMPT, imageBase64);
  return parseGeminiResponse(response);
}
