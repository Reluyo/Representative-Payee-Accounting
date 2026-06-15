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
  let query = db.transactions.where('accountId').equals(accountId);

  if (startDate && endDate) {
    return query
      .filter(t => t.date >= startDate && t.date <= endDate)
      .toArray();
  }

  return query.toArray();
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

export async function getReceiptsByDateRange(accountId: number, startDate: Date, endDate: Date) {
  const transactions = await getTransactions(accountId, startDate, endDate);
  const transactionIds = transactions.map(t => t.id!);

  const receipts = await db.receipts.toArray();
  return receipts.filter(r => r.transactionId && transactionIds.includes(r.transactionId));
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

  const receiptAppendix = await getReceiptsByDateRange(accountId, startDate, endDate);
  receiptAppendix.sort((a, b) => {
    const txA = transactions.find(t => t.id === a.transactionId);
    const txB = transactions.find(t => t.id === b.transactionId);
    if (!txA || !txB) return 0;
    return txA.date.getTime() - txB.date.getTime();
  });

  const report: DateRangeReport = {
    accountId,
    startDate,
    endDate,
    generatedDate: new Date(),
    transactions: transactions.sort((a, b) => b.date.getTime() - a.date.getTime()),
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

  return {
    version: 1,
    exportDate: new Date().toISOString(),
    accounts,
    transactions,
    receipts,
    categories,
  };
}

export async function importFromJSON(data: any) {
  if (data.version !== 1) {
    throw new Error('Unsupported backup format version');
  }

  await db.transaction('rw', db.accounts, db.transactions, db.receipts, db.categories, async () => {
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
  });
}
