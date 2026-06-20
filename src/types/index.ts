export interface Account {
  id?: number;
  name: string;
  type: 'SSA' | 'Retirement' | 'Other';
  balance: number;
  currency: string;
  createdDate: Date;
  lastUpdated: Date;
}

export interface Category {
  id?: number;
  name: string;
  type: 'medical' | 'food' | 'housing' | 'utilities' | 'transportation' | 'personal_care' | 'entertainment' | 'other';
  color: string;
}

export interface Receipt {
  id?: number;
  transactionId?: number;
  referenceNumber: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedDate: Date;
  data: string;
  blobData?: Blob;
  /** Path to the image in the Supabase `receipts` storage bucket, when cloud-backed. */
  storagePath?: string;
  originalText: string;
  extractedFields: {
    vendor?: string;
    amount?: number;
    date?: string;
    items?: string[];
  };
}

export interface Transaction {
  id?: number;
  accountId: number;
  date: Date;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  status: 'pending' | 'confirmed';
  receipts: Receipt[];
  aiExtractedData?: {
    vendor?: string;
    itemsDetected?: string[];
    timestamp?: Date;
    confidence?: number;
  };
}

export interface DateRangeReport {
  id?: number;
  accountId: number;
  startDate: Date;
  endDate: Date;
  generatedDate: Date;
  transactions: Transaction[];
  summary: Record<string, number>;
  totalIncome: number;
  totalExpense: number;
  notes: string;
  receiptAppendix: Receipt[];
}

export interface AppState {
  currentAccountId: number | null;
  accounts: Account[];
  categories: Category[];
}
