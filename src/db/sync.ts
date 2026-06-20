import { supabase } from './supabase';
import type { Account, Category, Transaction, Receipt } from '../types';

export async function syncAccountsToCloud(userId: string, accounts: Account[]) {
  for (const account of accounts) {
    const { data: existing } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', userId)
      .eq('name', account.name)
      .maybeSingle();

    if (existing) {
      await supabase.from('accounts').update({
        balance: account.balance,
        type: account.type,
        currency: account.currency,
        last_updated: new Date().toISOString(),
      }).eq('id', existing.id);
    } else {
      await supabase.from('accounts').insert({
        user_id: userId,
        name: account.name,
        type: account.type,
        balance: account.balance,
        currency: account.currency,
        created_date: account.createdDate instanceof Date ? account.createdDate.toISOString() : account.createdDate,
        last_updated: new Date().toISOString(),
      });
    }
  }
}

export async function syncCategoriesToCloud(userId: string, categories: Category[]) {
  const { data: existing } = await supabase
    .from('categories')
    .select('name')
    .eq('user_id', userId);

  const existingNames = new Set((existing ?? []).map(c => c.name));
  const toInsert = categories
    .filter(c => !existingNames.has(c.name))
    .map(c => ({ user_id: userId, name: c.name, type: c.type, color: c.color }));

  if (toInsert.length > 0) {
    await supabase.from('categories').insert(toInsert);
  }
}

export async function syncTransactionsToCloud(userId: string, cloudAccountId: number, transactions: Transaction[]) {
  for (const tx of transactions) {
    const { data: existing } = await supabase
      .from('transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('account_id', cloudAccountId)
      .eq('date', (tx.date instanceof Date ? tx.date : new Date(tx.date)).toISOString())
      .eq('amount', tx.amount)
      .eq('description', tx.description)
      .maybeSingle();

    if (!existing) {
      const { data: inserted } = await supabase.from('transactions').insert({
        user_id: userId,
        account_id: cloudAccountId,
        date: (tx.date instanceof Date ? tx.date : new Date(tx.date)).toISOString(),
        amount: tx.amount,
        category: tx.category,
        description: tx.description,
        type: tx.type,
        status: tx.status,
        ai_extracted_data: tx.aiExtractedData ?? null,
      }).select('id').single();

      if (inserted && tx.receipts?.length > 0) {
        for (const receipt of tx.receipts) {
          await syncReceiptToCloud(userId, inserted.id, receipt);
        }
      }
    }
  }
}

async function syncReceiptToCloud(userId: string, cloudTxId: number, receipt: Receipt) {
  let storagePath: string | null = null;

  if (receipt.blobData || receipt.data) {
    const fileName = `${userId}/${Date.now()}_${receipt.fileName}`;
    let fileBody: Blob;

    if (receipt.blobData) {
      fileBody = receipt.blobData;
    } else if (receipt.data?.startsWith('data:')) {
      const res = await fetch(receipt.data);
      fileBody = await res.blob();
    } else {
      fileBody = new Blob();
    }

    if (fileBody.size > 0) {
      const { error } = await supabase.storage
        .from('receipts')
        .upload(fileName, fileBody, { contentType: receipt.fileType || 'image/jpeg' });
      if (!error) storagePath = fileName;
    }
  }

  await supabase.from('receipts').insert({
    user_id: userId,
    transaction_id: cloudTxId,
    reference_number: receipt.referenceNumber,
    file_name: receipt.fileName,
    file_type: receipt.fileType,
    file_size: receipt.fileSize,
    uploaded_date: (receipt.uploadedDate instanceof Date ? receipt.uploadedDate : new Date(receipt.uploadedDate)).toISOString(),
    original_text: receipt.originalText || '',
    extracted_fields: receipt.extractedFields || {},
    storage_path: storagePath,
  });
}

// --- Cloud → Local fetching ---

export async function fetchAccountsFromCloud(userId: string): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_date');

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    name: row.name,
    type: row.type as Account['type'],
    balance: Number(row.balance),
    currency: row.currency,
    createdDate: new Date(row.created_date),
    lastUpdated: new Date(row.last_updated),
  }));
}

export async function fetchCategoriesFromCloud(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    name: row.name,
    type: row.type,
    color: row.color,
  }));
}

export async function fetchTransactionsFromCloud(userId: string, cloudAccountId: number): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('account_id', cloudAccountId)
    .order('date', { ascending: false });

  if (error || !data) return [];

  const transactions: Transaction[] = [];

  for (const row of data) {
    const { data: receiptRows } = await supabase
      .from('receipts')
      .select('*')
      .eq('transaction_id', row.id);

    const receipts: Receipt[] = (receiptRows ?? []).map(r => ({
      id: r.id,
      transactionId: r.transaction_id,
      referenceNumber: r.reference_number,
      fileName: r.file_name,
      fileType: r.file_type,
      fileSize: r.file_size,
      uploadedDate: new Date(r.uploaded_date),
      data: '',
      originalText: r.original_text,
      extractedFields: r.extracted_fields || {},
      _storagePath: r.storage_path,
    }));

    transactions.push({
      id: row.id,
      accountId: row.account_id,
      date: new Date(row.date),
      amount: Number(row.amount),
      category: row.category,
      description: row.description,
      type: row.type as 'income' | 'expense',
      status: row.status as 'pending' | 'confirmed',
      receipts,
      aiExtractedData: row.ai_extracted_data ?? undefined,
    });
  }

  return transactions;
}

// --- Cloud CRUD (used when logged in) ---

export async function createAccountCloud(userId: string, account: Omit<Account, 'id'>): Promise<number> {
  const { data, error } = await supabase.from('accounts').insert({
    user_id: userId,
    name: account.name,
    type: account.type,
    balance: account.balance,
    currency: account.currency,
    created_date: account.createdDate instanceof Date ? account.createdDate.toISOString() : account.createdDate,
    last_updated: account.lastUpdated instanceof Date ? account.lastUpdated.toISOString() : account.lastUpdated,
  }).select('id').single();

  if (error || !data) throw new Error(error?.message ?? 'Failed to create account');
  return data.id;
}

export async function updateAccountCloud(id: number, updates: Partial<Account>) {
  const mapped: Record<string, unknown> = {};
  if (updates.name !== undefined) mapped.name = updates.name;
  if (updates.type !== undefined) mapped.type = updates.type;
  if (updates.balance !== undefined) mapped.balance = updates.balance;
  if (updates.currency !== undefined) mapped.currency = updates.currency;
  if (updates.lastUpdated !== undefined) mapped.last_updated = updates.lastUpdated instanceof Date ? updates.lastUpdated.toISOString() : updates.lastUpdated;

  await supabase.from('accounts').update(mapped).eq('id', id);
}

export async function deleteAccountCloud(id: number) {
  await supabase.from('transactions').delete().eq('account_id', id);
  await supabase.from('accounts').delete().eq('id', id);
}

export async function createTransactionCloud(userId: string, tx: Omit<Transaction, 'id'>): Promise<number> {
  const { data, error } = await supabase.from('transactions').insert({
    user_id: userId,
    account_id: tx.accountId,
    date: (tx.date instanceof Date ? tx.date : new Date(tx.date)).toISOString(),
    amount: tx.amount,
    category: tx.category,
    description: tx.description,
    type: tx.type,
    status: tx.status,
    ai_extracted_data: tx.aiExtractedData ?? null,
  }).select('id').single();

  if (error || !data) throw new Error(error?.message ?? 'Failed to create transaction');

  if (tx.receipts?.length > 0) {
    for (const receipt of tx.receipts) {
      await syncReceiptToCloud(userId, data.id, receipt);
    }
  }

  return data.id;
}

export async function updateTransactionCloud(id: number, updates: Partial<Transaction>) {
  const mapped: Record<string, unknown> = {};
  if (updates.date !== undefined) mapped.date = (updates.date instanceof Date ? updates.date : new Date(updates.date)).toISOString();
  if (updates.amount !== undefined) mapped.amount = updates.amount;
  if (updates.category !== undefined) mapped.category = updates.category;
  if (updates.description !== undefined) mapped.description = updates.description;
  if (updates.type !== undefined) mapped.type = updates.type;
  if (updates.status !== undefined) mapped.status = updates.status;

  await supabase.from('transactions').update(mapped).eq('id', id);
}

export async function deleteTransactionCloud(id: number) {
  await supabase.from('receipts').delete().eq('transaction_id', id);
  await supabase.from('transactions').delete().eq('id', id);
}

export async function initCategoriesCloud(userId: string, defaults: Category[]) {
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('user_id', userId);

  if (!existing || existing.length === 0) {
    await supabase.from('categories').insert(
      defaults.map(c => ({ user_id: userId, name: c.name, type: c.type, color: c.color }))
    );
  }
}
