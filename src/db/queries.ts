import { db, defaultCategories } from './schema';
import type { Account, Category, Transaction, DateRangeReport, Receipt } from '../types';

export async function initializeDB() {
  const existingCategories = await db.categories.toArray();
  if (existingCategories.length === 0) {
    await db.categories.bulkAdd(defaultCategories);
  }
}

export async function createAccount(account: Omit<Account, 'id'>) {
  const id = await db.accounts.add(account as Account);
  return id;
}

export async function getAccounts() {
  return db.accounts.toArray();
}

export async function getAccount(id: number) {
  return db.accounts.get(id);
}

export async function updateAccount(id: number, updates: Partial<Account>) {
  return db.accounts.update(id, updates);
}

export async function deleteAccount(id: number) {
  await db.accounts.delete(id);
  await db.transactions.where('accountId').equals(id).delete();
}

export async function createTransaction(transaction: Omit<Transaction, 'id'>) {
  const id = await db.transactions.add(transaction as Transaction);
  return id;
}

export async function getTransactions(accountId: number, startDate?: Date, endDate?: Date) {
  if (startDate && endDate) {
    return db.transactions
      .where('[accountId+date]')
      .between([accountId, startDate], [accountId, endDate], true, true)
      .toArray();
  }

  return db.transactions.where('accountId').equals(accountId).toArray();
}

export async function getTransaction(id: number) {
  return db.transactions.get(id);
}

export async function updateTransaction(id: number, updates: Partial<Transaction>) {
  return db.transactions.update(id, updates);
}

export async function deleteTransaction(id: number) {
  await db.transactions.delete(id);
  const receipts = await db.receipts.where('transactionId').equals(id).toArray();
  await db.receipts.bulkDelete(receipts.map(r => r.id!));
}

export async function createReceipt(receipt: Omit<Receipt, 'id'>) {
  const id = await db.receipts.add(receipt as Receipt);
  return id;
}

export async function getReceipts(transactionId: number) {
  return db.receipts.where('transactionId').equals(transactionId).toArray();
}

// Uses the transactionId index rather than loading all receipts into memory
export async function getReceiptsByDateRange(accountId: number, startDate: Date, endDate: Date) {
  const transactions = await getTransactions(accountId, startDate, endDate);
  const transactionIds = transactions.map(t => t.id!).filter(Boolean);
  if (transactionIds.length === 0) return [];
  return db.receipts.where('transactionId').anyOf(transactionIds).toArray();
}

export async function getCategories() {
  return db.categories.toArray();
}

export async function createCategory(category: Omit<Category, 'id'>) {
  const id = await db.categories.add(category as Category);
  return id;
}

export async function generateDateRangeReport(
  accountId: number,
  startDate: Date,
  endDate: Date,
  notes: string = ''
): Promise<DateRangeReport> {
  const transactions = await getTransactions(accountId, startDate, endDate);
  const account = await getAccount(accountId);

  if (!account) throw new Error('Account not found');

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

  // Pull receipts from the transaction's embedded receipts array
  // (avoids duplicate storage issue and works regardless of receipts table state)
  const receiptAppendix: Receipt[] = transactions
    .filter(t => t.receipts && t.receipts.length > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .flatMap(t => t.receipts.map(r => ({ ...r, transactionId: t.id })));

  const report: DateRangeReport = {
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

  const id = await db.dateRangeReports.add(report as DateRangeReport);
  return { ...report, id };
}

export async function exportToJSON() {
  const accounts = await db.accounts.toArray();
  const transactions = await db.transactions.toArray();
  const receipts = await db.receipts.toArray();
  const categories = await db.categories.toArray();
  const dateRangeReports = await db.dateRangeReports.toArray();

  return {
    version: 1,
    exportDate: new Date().toISOString(),
    accounts,
    transactions,
    receipts,
    categories,
    dateRangeReports,
  };
}

export async function clearAllData() {
  await db.transaction('rw', [db.accounts, db.transactions, db.receipts, db.categories, db.dateRangeReports], async () => {
    await db.accounts.clear();
    await db.transactions.clear();
    await db.receipts.clear();
    await db.categories.clear();
    await db.dateRangeReports.clear();
  });
}

export async function importFromJSON(data: any) {
  if (data.version !== 1) {
    throw new Error('Unsupported backup format version');
  }

  await db.transaction('rw', [db.accounts, db.transactions, db.receipts, db.categories, db.dateRangeReports], async () => {
    if (data.accounts) {
      await db.accounts.bulkAdd(data.accounts);
    }
    if (data.transactions) {
      await db.transactions.bulkAdd(data.transactions);
    }
    if (data.receipts) {
      await db.receipts.bulkAdd(data.receipts);
    }
    if (data.categories && data.categories.length > 0) {
      const existing = await db.categories.toArray();
      if (existing.length === 0) {
        await db.categories.bulkAdd(data.categories);
      }
    }
    if (data.dateRangeReports) {
      await db.dateRangeReports.bulkAdd(data.dateRangeReports);
    }
  });
}
