import Dexie, { type Table } from 'dexie';
import type { Account, Category, Receipt, Transaction, MonthlyReport, DateRangeReport } from '../types';
import type { StoredBackup } from '../hooks/useAutoBackup';

export class AccountingDB extends Dexie {
  accounts!: Table<Account>;
  categories!: Table<Category>;
  transactions!: Table<Transaction>;
  receipts!: Table<Receipt>;
  monthlyReports!: Table<MonthlyReport>;
  dateRangeReports!: Table<DateRangeReport>;
  backups!: Table<StoredBackup>;

  constructor() {
    super('RepresentativePayeeDB');
    this.version(1).stores({
      accounts: '++id',
      categories: '++id',
      transactions: '++id, accountId, date',
      receipts: '++id, transactionId, referenceNumber',
      monthlyReports: '++id, accountId, [year+month]',
      dateRangeReports: '++id, accountId, [startDate+endDate]',
    });
    // Version 2 adds local backup storage
    this.version(2).stores({
      accounts: '++id',
      categories: '++id',
      transactions: '++id, accountId, date',
      receipts: '++id, transactionId, referenceNumber',
      monthlyReports: '++id, accountId, [year+month]',
      dateRangeReports: '++id, accountId, [startDate+endDate]',
      backups: '++id, date',
    });
  }
}

export const db = new AccountingDB();

export const defaultCategories: Category[] = [
  { name: 'Medical/Healthcare', type: 'medical', color: '#ef4444' },
  { name: 'Food & Groceries', type: 'food', color: '#f97316' },
  { name: 'Housing & Rent', type: 'housing', color: '#eab308' },
  { name: 'Utilities', type: 'utilities', color: '#22c55e' },
  { name: 'Transportation', type: 'transportation', color: '#06b6d4' },
  { name: 'Personal Care', type: 'personal_care', color: '#8b5cf6' },
  { name: 'Entertainment', type: 'entertainment', color: '#ec4899' },
  { name: 'Other', type: 'other', color: '#6b7280' },
];
